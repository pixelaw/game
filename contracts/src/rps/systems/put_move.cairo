#[system]
mod play_rps_system {
    use debug::PrintTrait;

    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};
    use serde::Serde;

    use dojo::world::Context;

    use pixelaw::paint::components::color_count::ColorCount;
    use pixelaw::components::position::Position;
    use pixelaw::components::color::Color;
    use pixelaw::components::owner::Owner;
    use pixelaw::components::timestamp::Timestamp;
    use pixelaw::components::text::Text;
    use pixelaw::components::pixel_type::PixelType;

    use pixelaw::systems::update_text::update_text_system;

    fn execute(
        ctx: Context,
        position: Position, // Param 1 : The position of the pixel to be changed
        hashed_commit: felt252
    ) {
        let pixel_id = (position.x, position.y).into();

        // Check if the PixelType is 'rps'
        let pixel_type = get !(ctx.world, pixel_id, (PixelType));
        assert(pixel_type.name == 'rps', 'PixelType is not paint!');

        // Check if the pixel is owned by the player
        let owner = get !(ctx.world, pixel_id, (Owner));

        // Create a new game
        let mut calldata = Default::default();

        // Serialize position
        position.serialize(ref calldata);

        let res = ctx.world.execute('create'.into(), calldata.span());
        let game_id = *res[0]; // The game id
        let game: felt252 = game_id.into();
        game.print();

        let mut calldata = Default::default();
        // Serialize game_id
        calldata.append(game_id);

        // Serialize hashed_commit
        calldata.append(hashed_commit);

        // Serialize position
        position.serialize(ref calldata);

        // Commit the move
        let res = ctx.world.execute('commit'.into(), calldata.span());

        // Update text
        // ? :	U+2753
        let mut calldata = Default::default();
        let text = Text { string: 'U+2753' };
        // Serialize Position
        position.serialize(ref calldata);
        // Serialize text
        text.serialize(ref calldata);

        let res = ctx.world.execute('update_text_system'.into(), calldata.span());

        return ();
    }
}
