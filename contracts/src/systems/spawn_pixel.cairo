// owner, position, color, text, timestamp

#[system]
mod spawn_pixel_system {
    use array::ArrayTrait;
    use traits::Into;
    use dojo::world::Context;
    use debug::PrintTrait;

    use pixelaw::components::color::Color;
    use pixelaw::components::owner::Owner;
    use pixelaw::components::permission::Permission;
    use pixelaw::components::position::Position;
    use pixelaw::components::text::Text;
    use pixelaw::components::timestamp::Timestamp;
    use pixelaw::components::pixel_type::PixelType;
    use pixelaw::systems::has_write_access_system;


    fn execute(
        ctx: Context,
        position: Position,
        pixel_type: felt252,
        allowlist: Array<felt252> // allowed systems to modify the core components of this pixel
    ) -> bool {
        let player_id: felt252 = ctx.origin.into();

        // Check if the pixel already exists
        let maybe_type = get!(ctx.world, (position.x, position.y).into(), (PixelType));
        assert(maybe_type.name == 0, 'Pixel already exists!');

        // Check if the caller is authorized to change the pixel
        let mut calldata = Default::default();
        calldata.append(position.x.into());
        calldata.append(position.y.into());
        calldata.append(ctx.system); // This system's name
        let res = ctx.world.execute('has_write_access_system'.into(), calldata);
        assert(*(res[0]) == 1, 'Not authorized to change pixel!');

        // Set Pixel components
        set !(
            ctx.world,
            (
                Owner {
                    x: position.x,
                    y: position.y,
                    address: player_id
                    },
                PixelType {
                    x: position.x,
                    y: position.y,
                    name: pixel_type
                    },
                Timestamp {
                    x: position.x,
                    y: position.y,
                    created_at: starknet::get_block_timestamp(),
                    updated_at: starknet::get_block_timestamp()
                },
            )
        );

        // Set default Pixel Systems
        let mut calldata = Default::default();
        calldata.append('update_color_system');
        calldata.append('update_owner_system');
        calldata.append('update_text_system');
        calldata.append('update_type_system');

        // Set Pixel Permission components
        let mut index = 0;
        let len = allowlist.len();
        loop {
            if index == len {
                break;
            }
            set !(
                ctx.world, // pixel + system is the storage key
                (Permission {
                    x: position.x,
                    y: position.y,
                    caller_system: *allowlist[index],
                    allowed: true
                })
            );
            index += 1;
        };
        return true;
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

    use pixelaw::systems::spawn_pixel_system;
    use pixelaw::systems::has_write_access_system;

    #[test]
    #[available_gas(300000000000)]
    fn test_spawn_pixel() {
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

        let pixel_type = world
            .entity(
                'PixelType'.into(),
                (position.x, position.y).into(),
                0,
                dojo::SerdeLen::<PixelType>::len()
            );
        assert(*pixel_type[0] == 'paint', 'PixelType not set correctly');
    }

    #[test]
    #[should_panic]
    #[available_gas(300000000000)]
    fn test_spawn_existing_pixel() {
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

        let pixel_type = world
            .entity(
                'PixelType'.into(),
                (position.x, position.y).into(),
                0,
                dojo::SerdeLen::<PixelType>::len()
            );
        assert(*pixel_type[0] == 'paint', 'PixelType not set correctly');

        // Try to spawn the same pixel again
        let mut calldata: Array = Default::default();
        let new_pixel_type = PixelType { name: 'rps' };
        position.serialize(ref calldata);
        new_pixel_type.serialize(ref calldata);
        allowlist.serialize(ref calldata);

        world.execute('spawn_pixel_system'.into(), calldata.span());
    }
}
