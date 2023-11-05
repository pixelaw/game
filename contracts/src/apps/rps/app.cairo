use starknet::{ContractAddress, ClassHash};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    use pixelaw::core::utils::{Direction, Position};
const STATE_NONE: u8 = 0;
const STATE_CREATED: u8 = 1;
const STATE_JOINED: u8 = 2;
const STATE_FINISHED: u8 = 3;

const APP_KEY: felt252 = 'rps';
const GAME_MAX_DURATION: u64 = 20000;

const ROCK: u8 = 1;
const PAPER: u8 = 2;
const SCISSORS: u8 = 3;


#[derive(Model, Copy, Drop, Serde, SerdeLen)]
struct Game {
    #[key]
    x: u64,
    #[key]
    y: u64,
    id: u32,
    state: u8,
    player1: ContractAddress,
    player2: ContractAddress,
    player1_commit: felt252,
    player1_move: u8,
    player2_move: u8,
    started_timestamp: u64
}

#[derive(Model, Copy, Drop, Serde, SerdeLen)]
struct Player {
    #[key]
    player_id: felt252,
    wins: u32
}


#[starknet::interface]
trait IActions<TContractState> {
    fn create(self: @TContractState, position: Position, commit: felt252);
    fn join(self: @TContractState, position: Position, player2_move: u8);
    fn finish(
            self: @TContractState, position: Position, player1_move: u8, player1_salt: felt252
        );
    fn reset(self: @TContractState, position: Position);
}

#[dojo::contract]
mod rps_actions {
    use poseidon::poseidon_hash_span;
    use debug::PrintTrait;
    use starknet::{ContractAddress, get_caller_address, ClassHash, get_contract_address};
    use dojo::executor::{IExecutorDispatcher, IExecutorDispatcherTrait};

    use pixelaw::core::models::registry::Registry;
    use pixelaw::core::models::pixel::{Pixel, PixelUpdate};
    use pixelaw::core::utils::{Direction, Position};

    use pixelaw::core::actions::{actions, IActionsDispatcher, IActionsDispatcherTrait};

    use super::IActions;
    use super::{APP_KEY, GAME_MAX_DURATION, ROCK, PAPER, SCISSORS};
    use super::{Game,  Player};
    use super::{STATE_NONE, STATE_CREATED, STATE_JOINED, STATE_FINISHED};

use zeroable::Zeroable;

    #[derive(Drop, starknet::Event)]
    struct GameCreated {
        game_id: u32,
        creator: ContractAddress
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        GameCreated: GameCreated
    }




    #[external(v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn create(self: @ContractState, position: Position, commit: felt252) {
            let world = self.world_dispatcher.read();
            let core_actions = Registry::core_actions(self.world_dispatcher.read());

            let player = get_caller_address();
            let pixel = get!(world, (position.x, position.y), Pixel);

            // Bail if the caller is not allowed here
            assert(pixel.owner.is_zero() || pixel.owner == player, 'Pixel is not players');

            // Load the game
            let mut game = get!(world, (position.x, position.y), Game);

            if game.id == 0 {
                // Bail if we're waiting for other player
                assert(game.state == STATE_CREATED, 'cannot reset rps game');

                // Player1 changing their commit
                game.player1_commit = commit;
            } else {
                game =
                    Game {
                        x: position.x,
                        y: position.y,
                        id: world.uuid(),
                        state: STATE_CREATED,
                        player1: player,
                        player2: Zeroable::zero(),
                        player1_commit: commit,
                        player1_move: 0,
                        player2_move: 0,
                        started_timestamp: starknet::get_block_timestamp()
                    };
                // Emit event
                emit!(world, GameCreated { game_id: game.id, creator: player });
            }

            // game entity
            set!(world, (game));

            core_actions
                .update_pixel(
                    player,
                    get_contract_address(),
                    PixelUpdate {
                        x: position.x,
                        y: position.y,
                        color: Option::None,
                        alert: Option::None, // TODO figure out how we use alert
                        timestamp: Option::None,
                        text: Option::Some(
                            'U+2753'
                        ), // TODO better approach, for now copying unicode codepoint
                        app: Option::Some(get_contract_address().into()),
                        owner: Option::Some(player.into())
                    }
                );
        }


        fn join(self: @ContractState, position: Position, player2_move: u8) {
            let world = self.world_dispatcher.read();
            let core_actions = Registry::core_actions(self.world_dispatcher.read());

            let player = get_caller_address();
            let pixel = get!(world, (position.x, position.y), Pixel);

            // Load the game
            let mut game = get!(world, (position.x, position.y), Game);

            // Bail if theres no game at all
            assert(game.id != 0, 'No game to join');

            // Bail if wrong gamestate
            assert(game.state == STATE_CREATED, 'Wrong gamestate');

            // Bail if the player is joining their own game
            assert(game.player1 != player, 'Cant join own game');

            // Update the game
            game.player2 = player;
            game.player2_move = player2_move;
            game.state = STATE_JOINED;

            // game entity
            set!(world, (game));

            core_actions
                .update_pixel(
                    player,
                    get_contract_address(),
                    PixelUpdate {
                        x: position.x,
                        y: position.y,
                        color: Option::None,
                        alert: Option::Some('!'), // TODO figure out how we use alert
                        timestamp: Option::None,
                        text: Option::Some(
                            'U+2757'
                        ), // TODO better approach, for now copying unicode codepoint
                        app: Option::None,
                        owner: Option::None
                    }
                );
        }


        fn finish(
            self: @ContractState, position: Position, player1_move: u8, player1_salt: felt252
        ) {
            let world = self.world_dispatcher.read();
            let core_actions = Registry::core_actions(self.world_dispatcher.read());

            let player = get_caller_address();
            let pixel = get!(world, (position.x, position.y), Pixel);

            // Load the game
            let mut game = get!(world, (position.x, position.y), Game);

            // Bail if theres no game at all
            assert(game.id != 0, 'No game to finish');

            // Bail if wrong gamestate
            assert(game.state == STATE_JOINED, 'Wrong gamestate');

            // Bail if the player is joining their own game
            assert(game.player1 == player, 'Cant finish others game');

            // Check player1's move
            assert(
                validate_commit(game.player1_commit, player1_move, player1_salt), 'player1 cheating'
            );

            // Decide the winner
            let winner = decide(player1_move, game.player2_move);

            if winner == 0 { // No winner: Wipe the pixel
                core_actions
                    .update_pixel(
                        player,
                        get_contract_address(),
                        PixelUpdate {
                            x: position.x,
                            y: position.y,
                            color: Option::None,
                            alert: Option::Some(0),
                            timestamp: Option::None,
                            text: Option::Some(0),
                            app: Option::Some(Zeroable::zero()),
                            owner: Option::Some(Zeroable::zero())
                        }
                    );
            // TODO emit event
            } else {
                // Update the game
                game.player1_move = player1_move;
                game.state = STATE_FINISHED;

                if winner == 2 {
                    // Change ownership of Pixel to player2
                    // TODO refactor, this could be cleaner
                    core_actions
                        .update_pixel(
                            player,
                            get_contract_address(),
                            PixelUpdate {
                                x: position.x,
                                y: position.y,
                                color: Option::None,
                                alert: Option::Some(0),
                                timestamp: Option::None,
                                text: Option::Some(get_unicode_for_rps(game.player2_move)),
                                app: Option::None,
                                owner: Option::Some(game.player2)
                            }
                        );
                } else {
                    core_actions
                        .update_pixel(
                            player,
                            get_contract_address(),
                            PixelUpdate {
                                x: position.x,
                                y: position.y,
                                color: Option::None,
                                alert: Option::Some(0),
                                timestamp: Option::None,
                                text: Option::Some(get_unicode_for_rps(game.player1_move)),
                                app: Option::None,
                                owner: Option::None
                            }
                        );
                }
            }

            // game entity
            set!(world, (game));
        }


        // TODO implement
        fn reset(self: @ContractState, position: Position) {
            let world = self.world_dispatcher.read();

            let mut game = get!(world, (position).into(), (Game));
        }
    }

    fn get_unicode_for_rps(rps: u8) -> felt252 {
        let mut result = 'U+1FAA8';
        if rps == ROCK {result = 'U+1FAA8';}
        else if rps == PAPER {result = 'U+1F9FB';}
        else if rps == SCISSORS {result = 'U+2702';}
        else {panic_with_felt252('incorrect rps');}
        result
    }

    fn validate_commit(committed_hash: felt252, commit: u8, salt: felt252) -> bool {
        let mut hash_span = ArrayTrait::<felt252>::new();
        hash_span.append(commit.into());
        hash_span.append(salt.into());

        let computed_hash: felt252 = poseidon_hash_span(hash_span.span());

        committed_hash == computed_hash
    }

    fn decide(player1_commit: u8, player2_commit: u8) -> u8 {
        if player1_commit == ROCK && player2_commit == PAPER {
            2
        } else if player1_commit == PAPER && player2_commit == ROCK {
            1
        } else if player1_commit == ROCK && player2_commit == SCISSORS {
            1
        } else if player1_commit == SCISSORS && player2_commit == ROCK {
            2
        } else if player1_commit == SCISSORS && player2_commit == PAPER {
            1
        } else if player1_commit == PAPER && player2_commit == SCISSORS {
            2
        } else {
            0
        }
    }

    // TODO: implement proper psuedo random number generator
    fn random(seed: felt252, min: u128, max: u128) -> u128 {
        let seed: u256 = seed.into();
        let range = max - min;

        (seed.low % range) + min
    }

    fn hash_commit(commit: u8, salt: felt252) -> felt252 {
        let mut hash_span = ArrayTrait::<felt252>::new();
        hash_span.append(commit.into());
        hash_span.append(salt.into());

        poseidon_hash_span(hash_span.span())
    }
}
