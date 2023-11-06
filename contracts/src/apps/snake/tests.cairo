
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
    use pixelaw::apps::snake::app::{Snake};



    use zeroable::Zeroable;


    // Helper function: deploys world and actions
    fn deploy_world() -> (IWorldDispatcher, IActionsDispatcher, ISnakeActionsDispatcher) {
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
        let core_actions = IActionsDispatcher {
            contract_address: world
                .deploy_contract('salt', actions::TEST_CLASS_HASH.try_into().unwrap())
        };

        // Deploy RPS actions
        let snake_actions = ISnakeActionsDispatcher {
            contract_address: world
                .deploy_contract('salt', snake_actions::TEST_CLASS_HASH.try_into().unwrap())
        };
        (world, core_actions, snake_actions)
    }

    #[test]
    #[available_gas(3000000000)]
    fn test_playthrough() {
        // Deploy everything
        let (world, core_actions, snake_actions) = deploy_world();

        core_actions.init();
        snake_actions.init();

        // Impersonate player1
        let player1 = starknet::contract_address_const::<0x1337>();
        let player2 = starknet::contract_address_const::<0x42>();
        starknet::testing::set_contract_address(player1);

    }
    
}
