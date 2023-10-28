use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

#[derive(Model, Copy, Drop, Serde)]
struct ActionsModel {
  #[key]
  key: felt252,
  value: ContractAddress
}

const KEY: felt252 = 'actions_model';

trait ActionsModelTrait {
  fn address(world: IWorldDispatcher) -> ContractAddress;
}

impl ActionsModelImpl of ActionsModelTrait {
  fn address(world: IWorldDispatcher) -> ContractAddress{
    let actions_model = get!(world, KEY, (ActionsModel));
    actions_model.value
  }
}
