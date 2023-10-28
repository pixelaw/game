use starknet::{ContractAddress, get_caller_address, ClassHash, get_contract_address};

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use pixelaw::core::actions::{
    IActionsDispatcher as ICoreActionsDispatcher,
    IActionsDispatcherTrait as ICoreActionsDispatcherTrait
};


#[derive(Model, Copy, Drop, Serde)]
struct AppBySystem {
    #[key]
    system: ContractAddress,
    name: felt252
}

#[derive(Model, Copy, Drop, Serde)]
struct AppByName {
    #[key]
    name: felt252,
    system: ContractAddress
}

#[derive(Model, Copy, Drop, Serde)]
struct CoreActionsAddress {
    #[key]
    key: felt252,
    value: ContractAddress
}


const CORE_ACTIONS_KEY: felt252 = 'actions_model';

#[generate_trait]
impl RegistryImpl of Registry {
    fn core_actions(world: IWorldDispatcher) -> ICoreActionsDispatcher {
        let address = get!(world, CORE_ACTIONS_KEY, (CoreActionsAddress));
        ICoreActionsDispatcher { contract_address: address.value }
    }

    // fn core_actions_address(world: IWorldDispatcher) -> ContractAddress{
    //   let actions_model = get!(world, KEY, (ActionsModel));
    //   actions_model.value
    // }

    fn set_core_actions_address(world: IWorldDispatcher, address: ContractAddress) {
      // TODO check if address already set, and if sender is authorized

        set!(world, (CoreActionsAddress { key: CORE_ACTIONS_KEY, value: address }))
    }

    fn new_app(world: IWorldDispatcher, system: ContractAddress, name: felt252) -> AppBySystem {
        // Load app_by_system
        let mut app_by_system = get!(world, system, (AppBySystem));

        // Load app_by_name
        let mut app_by_name = get!(world, name, (AppByName));

        // Ensure neither contract nor name have been registered
        assert(
            app_by_system.name == 0
                && app_by_name.system == starknet::contract_address_const::<0x0>(),
            'app already set'
        );

        // Associate system with name
        app_by_system.name = name;

        // Associate name with system
        app_by_name.system = system;

        // Store both associations
        set!(world, (app_by_system, app_by_name));

        // Return the system association
        app_by_system
    }
}

