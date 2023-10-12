use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

#[derive(Model, Copy, Drop, Serde)]
struct CoreActionsModel {
  #[key]
  key: felt252,
  value: ContractAddress
}

const KEY: felt252 = 'core_actions_model';

trait CoreActionsModelTrait {
  fn address(world: IWorldDispatcher) -> ContractAddress;
}

impl CoreActionsModelImpl of CoreActionsModelTrait {
  fn address(world: IWorldDispatcher) -> ContractAddress{
    let core_actions_model = get!(world, KEY, (CoreActionsModel));
    core_actions_model.value
  }
}
