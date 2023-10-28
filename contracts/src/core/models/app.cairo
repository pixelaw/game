use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

#[derive(Model, Copy, Drop, Serde)]
struct App {
  #[key]
  system: ContractAddress,
  name: felt252
}

#[derive(Model, Copy, Drop, Serde)]
struct AppName {
  #[key]
  name: felt252,
  system: ContractAddress
}

trait AppTrait {
  fn new(world: IWorldDispatcher, system: ContractAddress, name: felt252) -> App;
}

impl AppImpl of AppTrait {
  fn new(world: IWorldDispatcher, system: ContractAddress, name: felt252) -> App {
    let mut app = get!(world, system, (App));
    let mut app_name = get!(world, name, (AppName));
    assert(app.name == 0 && app_name.system == starknet::contract_address_const::<0x0>(), 'app already set');

    app.name = name;
    app_name.system = system;

    set!(world, (app, app_name));
    app
  }
}



