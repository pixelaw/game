#[system]
mod reset {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};

    use dojo::world::Context;
    use pixelaw::events::emit;
    use pixelaw::rps::events::GameCreated;
    use pixelaw::rps::components::game::Game;
    use pixelaw::rps::components::player::Player;
    use pixelaw::components::position::Position;

    use pixelaw::rps::constants::{
        STATE_IDLE, STATE_COMMIT_1, STATE_COMMIT_2, STATE_REVEAL_1, STATE_DECIDED, GAME_MAX_DURATION
    };

    use pixelaw::rps::utils::random;

    fn execute(ctx: Context, game_id: u32, position: Position) -> () {
        // let mut game = get !(ctx.world, (position.x, position.y).into(), (Game));
        // let player_id: felt252 = ctx.origin.into();

        // // check if the round expired
        // let time_now = starknet::get_block_timestamp();

        // // Error if the game is not expired
        // assert(
        //     (time_now - game.started_timestamp) > GAME_MAX_DURATION || game.state == STATE_DECIDED,
        //     'Game not expired'
        // );

        // // Reset the game
        // game.state = STATE_IDLE;
        // game.player1 = 0;
        // game.player2 = 0;
        // game.player1_hash = 0;
        // game.player2_hash = 0;
        // game.player1_commit = 0;
        // game.player2_commit = 0;
        // game.started_timestamp = 0;
        // game.winner = 0;

        // // Store the Game
        // set !(
        //     ctx.world,
        //     (game)
        // );
    }
}
