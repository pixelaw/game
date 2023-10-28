
#[cfg(test)]
mod tests {
  use core::traits::Into;
  use array::{ArrayTrait};
  use starknet::class_hash::Felt252TryIntoClassHash;

  use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

  use dojo::test_utils::{spawn_test_world, deploy_contract};

  use pixelaw::core::models::owner::owner;
  use pixelaw::core::models::owner::Owner;
  use pixelaw::core::models::permission::permission;
  use pixelaw::core::models::position::Position;
  use pixelaw::core::models::app::app;
  use pixelaw::core::models::app::PixelType;
  use pixelaw::core::models::timestamp::timestamp;
  use pixelaw::core::models::timestamp::Timestamp;
  use pixelaw::core::models::text::text;
  use pixelaw::core::models::color::Color;
  use pixelaw::core::models::color::color;
  use pixelaw::core::models::actions_model::actions_model;
  use debug::PrintTrait;

  use pixelaw::core::actions::{
    IActionsDispatcher as ICoreActionsDispatcher,
    IActionsDispatcherTrait as ICoreActionsDispatcherTrait
    };

  use super::{actions, IActionsDispatcher, IActionsDispatcherTrait, APP_KEY};

  #[test]
  #[available_gas(30000000)]
  fn test_put_color() {
    let caller = starknet::contract_address_const::<0x0>();

    // models
    let mut models = array![
      owner::TEST_CLASS_HASH,
      permission::TEST_CLASS_HASH,
      app::TEST_CLASS_HASH,
      timestamp::TEST_CLASS_HASH,
      text::TEST_CLASS_HASH,
      color::TEST_CLASS_HASH,
      actions_model::TEST_CLASS_HASH
    ];
    // deploy world with models
    let world = spawn_test_world(models);

    // deploy core actions contract
    let actions_address = world.deploy_contract(0, actions::TEST_CLASS_HASH.try_into().unwrap());
    let actions_system = IActionsDispatcher { contract_address: actions_address };
    actions_system.init();

    let contract_address = world.
      deploy_contract(0, actions::TEST_CLASS_HASH.try_into().unwrap());

    let actions_system = IActionsDispatcher { contract_address };
    actions_system.init();

    let position = Position {
      x: 0,
      y: 0
    };

    let new_color = Color {
      x: position.x,
      y: position.y,
      r: 1,
      g: 1,
      b: 1
    };

    actions_system.put_color(position.clone(), new_color);

    let (owner, app, timestamp) = get!(world, (position.x, position.y).into(), (Owner, PixelType, Timestamp));

    // check owner
    assert(owner.address == caller.into(), 'incorrect owner.address');
    assert(owner.x == position.x, 'incorrect owner.x');
    assert(owner.y == position.y, 'incorrect owner.y');

    // check app
    assert(app.name == APP_KEY, 'incorrect app.name');
    assert(app.x == position.x, 'incorrect app.x');
    assert(app.y == position.y, 'incorrect app.y');

    // check timestamp
    assert(timestamp.created_at == starknet::get_block_timestamp(), 'incorrect timestamp.created_at');
    assert(timestamp.updated_at == starknet::get_block_timestamp(), 'incorrect timestamp.updated_at');
    assert(timestamp.x == position.x, 'incorrect timestamp.x');
    assert(timestamp.y == position.y, 'incorrect timestamp.y');
  }
}
