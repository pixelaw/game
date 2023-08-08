// owner, position, color, text, timestamp

#[system]
mod update_type_system {
    use array::ArrayTrait;
    use traits::Into;
    use dojo::world::Context;

    use pixelaw::components::color::Color;
    use pixelaw::components::owner::Owner;
    use pixelaw::components::permission::Permission;
    use pixelaw::components::position::Position;
    use pixelaw::components::text::Text;
    use pixelaw::components::timestamp::Timestamp;
    use pixelaw::components::pixel_type::PixelType;
    use pixelaw::systems::has_write_access_system;

    use pixelaw::events::emit;
    use pixelaw::events::PixelTypeUpdated;

    fn execute(
        ctx: Context,
        position: Position, // Param 1 : The position of the pixel to be changed
        new_type: PixelType
    ) {
        // Check if the caller is authorized to change the pixel
        let mut calldata = Default::default();
        calldata.append(position.x.into());
        calldata.append(position.y.into());
        calldata.append(ctx.system); // This system's name
        let res = ctx.world.execute('has_write_access_system'.into(), calldata.span());
        assert(*(res[0]) == 1, 'Not authorized to change pixel!');

        // Retrieve the text of existing pixel at the specified position
        let maybe_type = try_get !(ctx.world, (position.x, position.y).into(), (PixelType));
        let pixel_type = match maybe_type {
            Option::Some(pixel_type) => pixel_type,
            Option::None(_) => PixelType { name: 0 },
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
                PixelType {
                    name: new_type.name
                    }, Timestamp {
                    created_at: timestamp.created_at, updated_at: starknet::get_block_timestamp()
                },
            )
        );

        // Emit an event to notify the frontend of the color change
        let mut values = array::ArrayTrait::new();
        serde::Serde::serialize(
            @PixelTypeUpdated { pixel_type: new_type, caller: ctx.origin.into() }, ref values
        );
        emit(ctx, 'PixelTypeUpdated', values.span());
    }
}

#[cfg(test)]
mod tests {
    use core::traits::{Into, Default};
    use array::ArrayTrait;
    use serde::Serde;

    use dojo::world::IWorldDispatcherTrait;

    use dojo::test_utils::spawn_test_world;
    use pixelaw::components::color::Color;
    use pixelaw::components::owner::Owner;
    use pixelaw::components::permission::Permission;
    use pixelaw::components::position::Position;
    use pixelaw::components::text::Text;
    use pixelaw::components::timestamp::Timestamp;
    use pixelaw::components::pixel_type::PixelType;

    use pixelaw::components::color::color;
    use pixelaw::components::owner::owner;
    use pixelaw::components::permission::permission;
    use pixelaw::components::position::position;
    use pixelaw::components::text::text;
    use pixelaw::components::timestamp::timestamp;
    use pixelaw::components::pixel_type::pixel_type;

    use pixelaw::systems::update_type_system;
    use pixelaw::systems::spawn_pixel_system;
    use pixelaw::systems::has_write_access_system;

    #[test]
    #[available_gas(300000000000)]
    fn test_update_type() {
        // components
        let mut components: Array = Default::default();
        components.append(color::TEST_CLASS_HASH);
        components.append(owner::TEST_CLASS_HASH);
        components.append(permission::TEST_CLASS_HASH);
        components.append(position::TEST_CLASS_HASH);
        components.append(text::TEST_CLASS_HASH);
        components.append(timestamp::TEST_CLASS_HASH);
        components.append(pixel_type::TEST_CLASS_HASH);

        // systems
        let mut systems: Array = Default::default();
        systems.append(has_write_access_system::TEST_CLASS_HASH);
        systems.append(spawn_pixel_system::TEST_CLASS_HASH);
        systems.append(update_type_system::TEST_CLASS_HASH);

        // deploy executor, world and register components/systems
        let world = spawn_test_world(components, systems);

        // construct calldata
        let mut calldata: Array = Default::default();

        // PixelType and Permission
        let position = Position { x: 1, y: 1 };
        let pixel_type = PixelType { name: 'paint' };
        let mut allowlist: Array<felt252> = Default::default();

        // Serialize to calldata
        position.serialize(ref calldata);
        pixel_type.serialize(ref calldata);
        allowlist.serialize(ref calldata);

        world.execute('spawn_pixel_system'.into(), calldata.span());

        // Get the PixelType
        let res_pixel_type = world
            .entity(
                'PixelType'.into(),
                (position.x, position.y).into(),
                0,
                dojo::SerdeLen::<PixelType>::len()
            );
        assert(*res_pixel_type[0] == pixel_type.name, 'PixelType is wrong');

        // Change the PixelType
        let new_pixel_type = PixelType { name: 'rps' };
        let position = Position { x: 1, y: 1 };
        let mut calldata: Array = Default::default();
        position.serialize(ref calldata);
        new_pixel_type.serialize(ref calldata);
        world.execute('update_type_system'.into(), calldata.span());

        let res_pixel_type = world
            .entity(
                'PixelType'.into(),
                (position.x, position.y).into(),
                0,
                dojo::SerdeLen::<PixelType>::len()
            );
        assert(*res_pixel_type[0] == new_pixel_type.name, 'PixelType is wrong');
    }
}
