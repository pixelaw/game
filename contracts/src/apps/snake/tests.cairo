#[cfg(test)]
mod tests {
    use starknet::class_hash::Felt252TryIntoClassHash;

    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use pixelaw::core::models::registry::{
        Registry, app_by_system, app_by_name, core_actions_address
    };

    use pixelaw::core::models::pixel::{Pixel, PixelUpdate};
    use pixelaw::core::models::pixel::{pixel};
    use pixelaw::core::models::permissions::{permissions};
    use pixelaw::core::utils::{Direction, Position, DefaultParameters};
    use pixelaw::core::actions::{actions, IActionsDispatcher, IActionsDispatcherTrait};

    use dojo::test_utils::{spawn_test_world, deploy_contract};

    use pixelaw::apps::snake::app::{
        snake_actions, snake, snake_segment, ISnakeActionsDispatcher, ISnakeActionsDispatcherTrait
    };
    use pixelaw::apps::paint::app::{
        paint_actions, IPaintActionsDispatcher, IPaintActionsDispatcherTrait
    };
    use pixelaw::apps::snake::app::{Snake};

    use debug::PrintTrait;

    use zeroable::Zeroable;


    // Helper function: deploys world and actions
    fn deploy_world() -> (
        IWorldDispatcher, IActionsDispatcher, ISnakeActionsDispatcher, IPaintActionsDispatcher
    ) {
        let player1 = starknet::contract_address_const::<0x1337>();


        // Deploy World and models
        let world = spawn_test_world(
            array![
                pixel::TEST_CLASS_HASH,
                app_by_system::TEST_CLASS_HASH,
                app_by_name::TEST_CLASS_HASH,
                core_actions_address::TEST_CLASS_HASH,
                permissions::TEST_CLASS_HASH,
                snake::TEST_CLASS_HASH,
                snake_segment::TEST_CLASS_HASH,
            ]
        );

        // Deploy Core actions
        let core_actions_address = world.deploy_contract('salt1', actions::TEST_CLASS_HASH.try_into().unwrap());
        let core_actions = IActionsDispatcher {
            contract_address: core_actions_address
        };

        // Deploy Snake actions
        let snake_actions_address = world.deploy_contract('salt2', snake_actions::TEST_CLASS_HASH.try_into().unwrap());
        let snake_actions = ISnakeActionsDispatcher {
            contract_address: snake_actions_address
        };

        // Deploy Paint actions
        let paint_actions = IPaintActionsDispatcher {
            contract_address: world
                .deploy_contract('salt3', paint_actions::TEST_CLASS_HASH.try_into().unwrap())
        };

        // Setup dojo auth
        world.grant_writer('Pixel',core_actions_address);
        world.grant_writer('AppBySystem',core_actions_address);
        world.grant_writer('AppByName',core_actions_address);
        world.grant_writer('CoreActionsAddress',core_actions_address);
        world.grant_writer('Permissions',core_actions_address);

        world.grant_writer('Snake',snake_actions_address);
        world.grant_writer('SnakeSegment',snake_actions_address);

        (world, core_actions, snake_actions, paint_actions)
    }


    #[test]
    #[available_gas(3000000000)]
    fn test_playthrough() {
        // Deploy everything
        let (world, core_actions, snake_actions, paint_actions) = deploy_world();
        let SNAKE_COLOR = 0xFF00FF;

        // Fix: increment uuid with 1 so the snake doesnt start with 0..
        world.uuid().print();

        core_actions.init();
        snake_actions.init();


        // Setup players
        let player1 = starknet::contract_address_const::<0x1337>();
        let player2 = starknet::contract_address_const::<0x42>();

        // Impersonate player1
        starknet::testing::set_account_contract_address(player1);

        let pixel1_1 = get!(world, (1, 1), Pixel);
        assert(pixel1_1.color == 0, 'wrong pixel color 1');

        // Spawn the snake
        let snake_id = snake_actions
            .interact(
                DefaultParameters {
                    for_player: Zeroable::zero(),
                    for_system: Zeroable::zero(),
                    position: Position { x: 1, y: 1 },
                    color: SNAKE_COLOR
                },
                Direction::Right
            );

        let pixel1_1 = get!(world, (1, 1), Pixel);
        assert(pixel1_1.color == SNAKE_COLOR, 'wrong pixel color 2');

        // Move the snake
        snake_actions.move(snake_id);

        // TODO check if there is a QueueScheduled event and if its correct

        // Check if the pixel is blank again at 1,1
        let pixel1_1 = get!(world, (1, 1), Pixel);
        assert(pixel1_1.color == 0, 'wrong pixel color 3');

        // Check that the pixel is snake at 2,1
        let pixel2_1 = get!(world, (2, 1), Pixel);
        assert(pixel2_1.color == SNAKE_COLOR, 'wrong pixel color 4');

        // Move right (head at 3,1 now)
        snake_actions.move(snake_id);

        // Check if the pixel is blank again at 2,1
        assert(get!(world, (2, 1), Pixel).color == 0, 'wrong pixel color 5');

        // Paint 4,1 so player1 owns it
        paint_actions
            .interact(
                DefaultParameters {
                    for_player: Zeroable::zero(),
                    for_system: Zeroable::zero(),
                    position: Position { x: 4, y: 1 },
                    color: 0xF0F0F0
                }
            );
        'owner'.print();
        get!(world, (4, 1), Pixel).owner.print();

        // Move right (head at 4,1 now) -> on top of the painted. Snake should grow
        snake_actions.move(snake_id);

        // Check that 3,1 is still snake color
        assert(get!(world, (3, 1), Pixel).color == SNAKE_COLOR, 'wrong pixel color 6');
    }
}