#[system]
mod create {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};

    use dojo::world::Context;
    use pixelaw::events::emit;
    use pixelaw::components::position::Position;
    use pixelaw::rps::events::GameCreated;
    use pixelaw::rps::components::game::Game;
    use pixelaw::rps::components::player::Player;

    use pixelaw::rps::constants::{STATE_IDLE, STATE_COMMIT_1, STATE_COMMIT_2, STATE_REVEAL_1};

    use pixelaw::rps::utils::random;

    fn execute(ctx: Context, position: Position) -> (u32, felt252) {
        let game_id = ctx.world.uuid();
        let player_id: felt252 = ctx.origin.into();
        let pixel_id = (position.x, position.y).into();

        // game entity
        set !(
            ctx.world,
            pixel_id,
            (Game {
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

        // emit game created
        let mut values = array::ArrayTrait::new();
        serde::Serde::serialize(@GameCreated { game_id, creator: player_id }, ref values);
        emit(ctx, 'GameCreated', values.span());

        (game_id, player_id)
    }
}
