// owner, position, color, text, timestamp

#[system]
mod put_color_system {
    use array::ArrayTrait;
    use traits::Into;
    use dojo::world::Context;
    use serde::Serde;
    use debug::PrintTrait;

    use pixelaw::paint::components::color_count::ColorCount;
    use pixelaw::components::position::Position;
    use pixelaw::components::color::Color;
    use pixelaw::components::owner::Owner;
    use pixelaw::components::timestamp::Timestamp;
    use pixelaw::components::pixel_type::PixelType;

    fn execute(
        ctx: Context,
        position: Position, // Param 1 : The position of the pixel to be changed
        new_color: Color
    ) {
        let mut calldata = Default::default();

        let pixel_id = (position.x, position.y).into();

        // Check if the PixelType is 'paint'
        let pixel_type = get !(ctx.world, pixel_id, (PixelType));
        assert(pixel_type.name == 'paint', 'PixelType is not paint!');

        // Get timestamp to check if cooldown is over
        let maybe_timestamp = try_get !(ctx.world, pixel_id, Timestamp);
        let timestamp = match maybe_timestamp {
            Option::Some(timestamp) => timestamp,
            Option::None(_) => Timestamp { created_at: 0, updated_at: 0 },
        };

        // Check if the pixel is owned by the sender
        let owner = get !(ctx.world, pixel_id, Owner);

        // Check if 5 seconds have passed or if the sender is the owner
        assert(
            (owner.address) == ctx.origin.into() || starknet::get_block_timestamp()
                - timestamp.updated_at < 5,
            'Cooldown not over'
        );

        // Serialize Position
        position.serialize(ref calldata);

        // Serialize color
        new_color.serialize(ref calldata);

        // Update the color count if color is different
        let maybe_color_count = try_get !(ctx.world, pixel_id, ColorCount);
        let mut color_count = match maybe_color_count {
            Option::Some(color_count) => color_count,
            Option::None(_) => ColorCount { count: 0 },
        };

        let maybe_color = try_get !(ctx.world, pixel_id, Color);
        let color = match maybe_color {
            Option::Some(color) => color,
            Option::None(_) => Color { r: 0, g: 0, b: 0 },
        };

        // Call the update_color_system
        ctx.world.execute('update_color_system'.into(), calldata.span());

        // Update the color if it is different
        if color != new_color {
            // Update the color count
            set !(ctx.world, pixel_id, (ColorCount { count: color_count.count + 1 }));
        }
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

    use pixelaw::systems::update_color_system;
    use pixelaw::systems::update_owner_system;
    use pixelaw::systems::update_text_system;
    use pixelaw::systems::update_type_system;
    use pixelaw::systems::spawn_pixel_system;
    use pixelaw::systems::has_write_access_system;
    use pixelaw::paint::systems::put_color::put_color_system;

    #[test]
    #[available_gas(300000000000)]
    fn test_put_color() {
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
        systems.append(update_color_system::TEST_CLASS_HASH);
        systems.append(update_owner_system::TEST_CLASS_HASH);
        systems.append(update_text_system::TEST_CLASS_HASH);
        systems.append(update_type_system::TEST_CLASS_HASH);
        systems.append(put_color_system::TEST_CLASS_HASH);

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

        // Put the color
        let new_color = Color { r: 0, g: 128, b: 0 };
        let position = Position { x: 1, y: 1 };
        let mut calldata: Array = Default::default();
        position.serialize(ref calldata);
        new_color.serialize(ref calldata);
        world.execute('put_color_system'.into(), calldata.span());

        let color = world
            .entity(
                'Color'.into(), (position.x, position.y).into(), 0, dojo::SerdeLen::<Color>::len()
            );
        assert(*color[0] == 0, 'color r is wrong');
        assert(*color[1] == 128, 'color g is wrong');
        assert(*color[2] == 0, 'color b is wrong');
    }
}
