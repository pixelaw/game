// owner, position, color, text, timestamp

#[system]
mod update_text_system {
    use array::ArrayTrait;
    use traits::Into;
    use dojo::world::Context;

    use pixelaw::components::color::Color;
    use pixelaw::components::owner::Owner;
    use pixelaw::components::permission::Permission;
    use pixelaw::components::position::Position;
    use pixelaw::components::text::Text;
    use pixelaw::components::timestamp::Timestamp;
    use pixelaw::systems::has_write_access_system;

    use pixelaw::events::emit;
    use pixelaw::events::TextUpdated;

    fn execute(
        ctx: Context,
        position: Position, // Param 1 : The position of the pixel to be changed
        new_text: Text
    ) {
        // Check if the caller is authorized to change the pixel
        let mut calldata = Default::default();
        calldata.append(position.x.into());
        calldata.append(position.y.into());
        calldata.append(ctx.system); // This system's name
        let res = ctx.world.execute('has_write_access_system'.into(), calldata.span());
        assert(*(res[0]) == 1, 'Not authorized to change pixel!');

        // Retrieve the text of existing pixel at the specified position
        let maybe_text = try_get !(ctx.world, (position.x, position.y).into(), (Text));
        let text = match maybe_text {
            Option::Some(text) => text,
            Option::None(_) => Text { string: 0 },
        };

        let maybe_timestamp = try_get !(ctx.world, (position.x, position.y).into(), (Timestamp));
        let timestamp = match maybe_timestamp {
            Option::Some(timestamp) => timestamp,
            Option::None(_) => Timestamp { created_at: 0, updated_at: 0 },
        };

        // Update the pixel's owner and timestamp in the world state at the specified position
        set !(
            ctx.world,
            (position.x, position.y).into(),
            (
                Text {
                    string: new_text.string
                    }, Timestamp {
                    created_at: timestamp.created_at, updated_at: starknet::get_block_timestamp()
                },
            )
        );

        // Emit an event to notify the frontend of the color change
        let mut values = array::ArrayTrait::new();
        serde::Serde::serialize(
            @TextUpdated { text: new_text, caller: ctx.origin.into() }, ref values
        );
        emit(ctx, 'TextUpdated', values.span());
    }
}
