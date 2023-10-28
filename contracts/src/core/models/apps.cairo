use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

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



#[generate_trait]
impl AppsImpl of Apps {
  fn new(world: IWorldDispatcher, system: ContractAddress, name: felt252) -> AppBySystem {

    // Load app_by_system
    let mut app_by_system = get!(world, system, (AppBySystem));

    // Load app_by_name 
    let mut app_by_name = get!(world, name, (AppByName));
    
    // Ensure neither contract nor name have been registered
    assert(app_by_system.name == 0 && app_by_name.system == starknet::contract_address_const::<0x0>(), 'app already set');

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



