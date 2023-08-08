#[system]
mod reveal {
    use debug::PrintTrait;

    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};

    use dojo::world::Context;
    use dojo_rps::events::{emit, GameCreated};
    use dojo_rps::components::game::Game;
    use dojo_rps::components::player::Player;

    use poseidon::poseidon_hash_span;

    use dojo_rps::constants::{
        STATE_IDLE,STATE_COMMIT_1,STATE_COMMIT_2,STATE_REVEAL_1,STATE_DECIDED, ROCK, PAPER, SCISSORS
    };

    use dojo_rps::utils::random;

    fn validate_commit(
        committed_hash: felt252,
        commit: u8,
        salt: felt252
    ) -> bool{

        let mut hash_span = ArrayTrait::<felt252>::new();
        hash_span.append(commit.into());
        hash_span.append(salt.into());

        let computed_hash: felt252 = poseidon_hash_span(hash_span.span());

        committed_hash == computed_hash
    }

    fn decide(player1_commit: u8, player2_commit: u8) -> u8 {
        if player1_commit == ROCK && player2_commit == PAPER {
            2
        }else if player1_commit == PAPER && player2_commit == ROCK {
            1
        }else if player1_commit == ROCK && player2_commit == SCISSORS {
            1
        }else if player1_commit == SCISSORS && player2_commit == ROCK {
            2
        }else if player1_commit == SCISSORS && player2_commit == PAPER {
            1
        }else if player1_commit == PAPER && player2_commit == SCISSORS {
            2
        }else{
            0
        }
    }

    fn execute(
        ctx: Context,
        game_id: u32,
        hashed_commit: felt252,
        commit: u8,
        salt: felt252
    ) -> () {

        // Retrieve Game and Player
        let mut game = get !(ctx.world, game_id.into(), Game);
        let player_id: felt252 = ctx.origin.into();


        // Make sure the gamestate is ready for revealing
        assert(game.state != STATE_COMMIT_2 || game.state != STATE_REVEAL_1, 'Cannot reveal now');

        // Make sure the player is valid
        assert(player_id == game.player1 || player_id == game.player2, 'Invalid player');

        // Its either player1 or player2 revealing now
        if game.player1 == player_id {
            assert(validate_commit(game.player1_hash, commit, salt), 'Wrong hash for player1');
            game.player1_commit = commit;
        }else if game.player2 == player_id {
            assert(validate_commit(game.player2_hash, commit, salt), 'Wrong hash for player2');
            game.player2_commit = commit;

        }


        // We can now decide the winner
        if game.state == STATE_REVEAL_1  {
            let winner = decide(game.player1_commit, game.player2_commit);
            winner.print();
            game.winner = winner;
            if winner == 0 {
                // TODO emit event for "Draw"
            } else if winner == 1 {
                // TODO emit event for Player1 wins
            }else if winner == 2 {
                // TODO emit event for Player2 wins
            }

            // switch the state to decided
            game.state = STATE_DECIDED;

        }else {
            game.state = STATE_REVEAL_1

        }

        // Store the Game
        set !(
            ctx.world,
            game_id.into(),
            (Game {
                game_id: game.game_id,
                state: game.state,
                player1: game.player1,
                player2: game.player2,
                player1_hash: game.player1_hash,
                player2_hash: game.player2_hash,
                player1_commit: game.player1_commit,
                player2_commit: game.player2_commit,
                started_timestamp: game.started_timestamp,
                winner: game.winner
            })
        );
    }
}
