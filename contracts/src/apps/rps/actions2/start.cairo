#[system]
mod commit {
    use debug::PrintTrait;


    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};

    use dojo::world::Context;
    use dojo_rps::events::{emit, GameCreated};
    use dojo_rps::components::game::Game;
    use dojo_rps::components::player::Player;

    use dojo_rps::constants::{
        STATE_IDLE,STATE_COMMIT_1,STATE_COMMIT_2,STATE_REVEAL_1,GAME_MAX_DURATION
    };

    use dojo_rps::utils::random;

    fn execute(
        ctx: Context,
        position: Position,
        choice_hash: felt252
    ) -> () {

        // Load the Pixel at the given position

        // Error if the player is not allowed here

        // Default mode is STARTING

        // Scan 4 surrounding Pixels to find out if we're starting or joining a game
            // Load Pixels for [x,y+1], [x+1,y], [x, y-1], [x-1, y]
            // If type==RpsPixel and owner != player then keep this as "other_position"
                // mode is now JOINING

        // If mode==STARTING (pixel is empty and no neighbouring RPS pixels found)
            // Write pixeltype, choice_hash
            // done


        // If mode==JOINING (pixel is empty but there is a neighbouring RPS pixel found)
            // Write pixeltype, choice_hash
            // Write other_position  pixel




        // Retrieve Game and Player
        let mut game = get !(ctx.world, game_id.into(), Game);
        let player_id: felt252 = ctx.origin.into();

        // Handle game state
        if game.state == STATE_IDLE {
            game.player1 = player_id;
            game.player1_hash = choice_hash;
            game.state = STATE_COMMIT_1;
            game.started_timestamp = starknet::get_block_timestamp();

        }else if game.state == STATE_COMMIT_1 {

            // Ensure the second player is different
            assert(game.player1 != player_id, 'Player cannot commit twice');

            // Commitment for player 2
            game.player2 = player_id;
            game.player2_hash = choice_hash;
            game.state = STATE_COMMIT_2;

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
