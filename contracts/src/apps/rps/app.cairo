use starknet::{ContractAddress, ClassHash};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use pixelaw::core::models::position::Position;
use pixelaw::core::models::color::Color;


const STATE_IDLE: u8 = 1;
const STATE_COMMIT_1: u8 = 2;
const STATE_COMMIT_2: u8 = 3;
const STATE_REVEAL_1: u8 = 4;
const STATE_DECIDED: u8 = 5;

const PIXEL_TYPE: felt252 = 'rps';
const GAME_MAX_DURATION: u64 = 20000;
const ROCK: u8 = 1;
const PAPER: u8 = 2;
const SCISSORS: u8 = 3;


#[derive(Copy, Drop, Serde, SerdeLen, Introspect)]
struct RPSType {
    commit_hash: felt252,
    play: u8,
    other_position: Position
}


#[derive(Model, Copy, Drop, Serde, SerdeLen)]
struct Game {
    #[key]
    x: u64,
    #[key]
    y: u64,
    game_id: u32,
    state: u8,
    player1: felt252,
    player2: felt252,
    player1_hash: felt252,
    player2_hash: felt252,
    player1_commit: u8,
    player2_commit: u8,
    started_timestamp: u64,
    winner: u8
}

#[derive(Model, Copy, Drop, Serde, SerdeLen)]
struct Player {
    #[key]
    player_id: felt252,
    wins: u32
}


#[starknet::interface]
trait IActions<TContractState> {
    fn create(self: @TContractState, position: Position, hashed_commit: felt252);
    fn commit(self: @TContractState, position: Position, hashed_commit: felt252);
    fn finish(
        self: @TContractState, position: Position, hashed_commit: felt252, commit: u8, salt: felt252
    );
    fn reset(self: @TContractState, position: Position);
}

#[dojo::contract]
mod actions {
    use poseidon::poseidon_hash_span;
    use debug::PrintTrait;
    use starknet::{ContractAddress, get_caller_address, ClassHash, get_contract_address};
    use dojo::executor::{IExecutorDispatcher, IExecutorDispatcherTrait};

    use pixelaw::core::models::position::Position;
    use pixelaw::core::models::color::Color;
    use pixelaw::core::models::registry::Registry;

    use pixelaw::core::actions::{
        actions, IActionsDispatcher, IActionsDispatcherTrait
    };

    use super::IActions;
    use super::{PIXEL_TYPE, GAME_MAX_DURATION, ROCK, PAPER, SCISSORS};
    use super::{Game, RPSType, Player};
    use super::{STATE_COMMIT_1, STATE_COMMIT_2, STATE_DECIDED, STATE_IDLE, STATE_REVEAL_1};


    #[derive(Drop, starknet::Event)]
    struct GameCreated {
        game_id: u32,
        creator: felt252
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        GameCreated: GameCreated
    }

    #[external(v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn create(self: @ContractState, position: Position, hashed_commit: felt252) {
            let world = self.world_dispatcher.read();

            let game_id = world.uuid();
            let player_id: felt252 = get_caller_address().into();

            // game entity
            set!(
                world,
                (Game {
                    x: position.x,
                    y: position.y,
                    game_id,
                    state: STATE_IDLE,
                    player1: 0,
                    player2: 0,
                    player1_hash: 0,
                    player2_hash: 0,
                    player1_commit: 0,
                    player2_commit: 0,
                    started_timestamp: 0,
                    winner: 0
                })
            );

            emit!(world, GameCreated { game_id: game_id, creator: player_id });
        // TODO fix event emit (new method in dojo 0.3)
        // // emit game created
        // let mut values = array::ArrayTrait::new();
        // serde::Serde::serialize(@GameCreated { game_id, creator: player_id }, ref values);
        // emit(ctx, 'GameCreated', values.span());

        // (game_id, player_id)
        }
        fn commit(self: @ContractState, position: Position, hashed_commit: felt252) {
            let world = self.world_dispatcher.read();

            // Retrieve Game and Player
            let mut game = get!(world, (position.x, position.y).into(), (Game));
            let player_id: felt252 = get_caller_address().into();

            // Handle game state
            if game.state == STATE_IDLE {
                game.player1 = player_id;
                game.player1_hash = hashed_commit;
                game.state = STATE_COMMIT_1;
                game.started_timestamp = starknet::get_block_timestamp();
            } else if game.state == STATE_COMMIT_1 {
                // Ensure the second player is different
                assert(game.player1 != player_id, 'Player cannot commit twice');

                // Commitment for player 2
                game.player2 = player_id;
                game.player2_hash = hashed_commit;
                game.state = STATE_COMMIT_2;
            }
            // Store the Game
            set!(world, (game));
        }

        fn finish(
            self: @ContractState,
            position: Position,
            hashed_commit: felt252,
            commit: u8,
            salt: felt252
        ) {
            // Retrieve Game and Player
            let world = self.world_dispatcher.read();

            let mut game = get!(world, (position.x, position.y).into(), (Game));
            let player_id: felt252 = get_caller_address().into();

            // Make sure the gamestate is ready for revealing
            assert(
                game.state != STATE_COMMIT_2 || game.state != STATE_REVEAL_1, 'Cannot reveal now'
            );

            // Make sure the player is valid
            assert(player_id == game.player1 || player_id == game.player2, 'Invalid player');

            // Its either player1 or player2 revealing now
            if game.player1 == player_id {
                assert(validate_commit(game.player1_hash, commit, salt), 'Wrong hash for player1');
                game.player1_commit = commit;
            } else if game.player2 == player_id {
                assert(validate_commit(game.player2_hash, commit, salt), 'Wrong hash for player2');
                game.player2_commit = commit;
            }

            // We can now decide the winner
            if game.state == STATE_REVEAL_1 {
                let winner = decide(game.player1_commit, game.player2_commit);
                winner.print();
                game.winner = winner;
                if winner == 0 { // TODO emit event for "Draw"
                } else if winner == 1 { // TODO emit event for Player1 wins
                } else if winner == 2 { // TODO emit event for Player2 wins
                }

                // switch the state to decided
                game.state = STATE_DECIDED;
            } else {
                game.state = STATE_REVEAL_1
            }

            // Store the Game
            // TODO this may be wrong
            set!(world, (game));
        }

        fn reset(self: @ContractState, position: Position) {
            let world = self.world_dispatcher.read();

            let mut game = get!(world, (position.x, position.y).into(), (Game));
            let player_id: felt252 = get_caller_address().into();

            // check if the round expired
            let time_now = starknet::get_block_timestamp();

            // Error if the game is not expired
            assert(
                (time_now - game.started_timestamp) > GAME_MAX_DURATION
                    || game.state == STATE_DECIDED,
                'Game not expired'
            );

            // Reset the game
            game.state = STATE_IDLE;
            game.player1 = 0;
            game.player2 = 0;
            game.player1_hash = 0;
            game.player2_hash = 0;
            game.player1_commit = 0;
            game.player2_commit = 0;
            game.started_timestamp = 0;
            game.winner = 0;

            // Store the Game
            set!(world, (game));
        }
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
