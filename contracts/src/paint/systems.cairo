use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use pixelaw::models::position::Position;
use pixelaw::models::color::Color;

#[starknet::interface]
trait IPaintActions<TContractState> {
  fn init(self: @TContractState);
  fn put_color(self: @TContractState, position: Position, new_color: Color);
  fn remove_color(self: @TContractState, position: Position);
}

const PIXEL_TYPE: felt252 = 'paint';

#[dojo::contract]
mod paint_actions {
  use starknet::{get_caller_address, get_contract_address};

  use super::IPaintActions;
  use pixelaw::models::position::Position;
  use pixelaw::models::color::Color;
  use pixelaw::models::pixel_type::PixelType;
  use pixelaw::models::timestamp::Timestamp;
  use pixelaw::models::owner::Owner;
  use pixelaw::models::needs_attention::NeedsAttention;
  use pixelaw::models::core_actions_model::CoreActionsModelTrait;
  use pixelaw::systems::{core_actions, ICoreActionsDispatcher, ICoreActionsDispatcherTrait};
  use super::PIXEL_TYPE;

  const REMOVE_COLOR_ENTRYPOINT: felt252 = 0x016af38c75fbaa0eb1f1b769bd94962da4e5d65456a470acc8f056e9c20a7d93;

  fn core_actions_system(self: @ContractState) -> ICoreActionsDispatcher {
    let world = self.world_dispatcher.read();
    let core_actions_address = CoreActionsModelTrait::address(world);
    ICoreActionsDispatcher { contract_address: core_actions_address }
  }

  // impl: implement functions specified in trait
  #[external(v0)]
  impl PaintActionsImpl of IPaintActions<ContractState> {
    fn init(self: @ContractState) {
      let core_actions_system = core_actions_system(self);
      core_actions_system.update_app_name(PIXEL_TYPE);
    }
    fn put_color(self: @ContractState, position: Position, new_color: Color) {
      let world = self.world_dispatcher.read();

      // Check if the PixelType is 'paint'
      let (
        pixel_type,
        timestamp,
        owner,
        color,
        needs_attention
      ) = get !(world, (position.x, position.y).into(), (PixelType, Timestamp, Owner, Color, NeedsAttention));

      let core_actions_system = core_actions_system(self);

      let player: felt252 = get_caller_address().into();

      if owner.address == 0 {
        let mut allowlist: Array<felt252> = ArrayTrait::new();
        let contract_address: felt252 = get_contract_address().into();
        allowlist.append(contract_address);
        core_actions_system.spawn_pixel(player, position, PIXEL_TYPE, allowlist)
      } else {
        // only check pixel type if pixel has already been spawned
        assert(pixel_type.name == 'paint', 'PixelType is not paint!')
      }


      // Check if 5 seconds have passed or if the sender is the owner
      assert(
        owner.address == 0 ||
        (owner.address) == player ||
          starknet::get_block_timestamp() - timestamp.updated_at < 5,
          'Cooldown not over'
      );

      core_actions_system.update_color(player, position, new_color);

      if needs_attention.value {
        core_actions_system.update_needs_attention(
          player,
          position,
          NeedsAttention {
            x: position.x,
            y: position.y,
            value: false
          }
        )
      }

      let unlock_time = starknet::get_block_timestamp() + 10;
      let calldata: Array<felt252> = ArrayTrait::new();
      core_actions_system.schedule_queue(
        unlock_time,
        PIXEL_TYPE,
        REMOVE_COLOR_ENTRYPOINT,
        calldata.span());
    }

    fn remove_color(self: @ContractState, position: Position){
      let world = self.world_dispatcher.read();
      let core_actions_system = ICoreActionsDispatcher { contract_address: world.contract_address };

      let removed_color = Color {
        x: position.x,
        y: position.y,
        r: 0,
        g: 0,
        b: 0
      };
      core_actions_system.update_color(PIXEL_TYPE, position, removed_color);

      let needs_attention = NeedsAttention {
        x: position.x,
        y: position.y,
        value: true
      };
      core_actions_system.update_needs_attention(PIXEL_TYPE, position, needs_attention);
    }
  }
}

#[cfg(test)]
mod tests {
  use core::traits::Into;
  use array::{ArrayTrait};
  use starknet::class_hash::Felt252TryIntoClassHash;

  use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

  use dojo::test_utils::{spawn_test_world, deploy_contract};

  use pixelaw::models::owner::owner;
  use pixelaw::models::owner::Owner;
  use pixelaw::models::permission::permission;
  use pixelaw::models::position::Position;
  use pixelaw::models::pixel_type::pixel_type;
  use pixelaw::models::pixel_type::PixelType;
  use pixelaw::models::timestamp::timestamp;
  use pixelaw::models::timestamp::Timestamp;
  use pixelaw::models::text::text;
  use pixelaw::models::color::Color;
  use pixelaw::models::color::color;
  use pixelaw::models::core_actions_model::core_actions_model;
  use debug::PrintTrait;

  use pixelaw::systems::{core_actions, ICoreActionsDispatcher, ICoreActionsDispatcherTrait};
  use super::{paint_actions, IPaintActionsDispatcher, IPaintActionsDispatcherTrait, PIXEL_TYPE};

  #[test]
  #[available_gas(30000000)]
  fn test_put_color() {
    let caller = starknet::contract_address_const::<0x0>();

    // models
    let mut models = array![
      owner::TEST_CLASS_HASH,
      permission::TEST_CLASS_HASH,
      pixel_type::TEST_CLASS_HASH,
      timestamp::TEST_CLASS_HASH,
      text::TEST_CLASS_HASH,
      color::TEST_CLASS_HASH,
      core_actions_model::TEST_CLASS_HASH
    ];
    // deploy world with models
    let world = spawn_test_world(models);

    // deploy core actions contract
    let core_actions_address = world.deploy_contract(0, core_actions::TEST_CLASS_HASH.try_into().unwrap());
    let core_actions_system = ICoreActionsDispatcher { contract_address: core_actions_address };
    core_actions_system.init();

    let contract_address = world.
      deploy_contract(0, paint_actions::TEST_CLASS_HASH.try_into().unwrap());

    let paint_actions_system = IPaintActionsDispatcher { contract_address };
    paint_actions_system.init();

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

    paint_actions_system.put_color(position.clone(), new_color);

    let (owner, pixel_type, timestamp) = get!(world, (position.x, position.y).into(), (Owner, PixelType, Timestamp));

    // check owner
    assert(owner.address == caller.into(), 'incorrect owner.address');
    assert(owner.x == position.x, 'incorrect owner.x');
    assert(owner.y == position.y, 'incorrect owner.y');

    // check pixel_type
    assert(pixel_type.name == PIXEL_TYPE, 'incorrect pixel_type.name');
    assert(pixel_type.x == position.x, 'incorrect pixel_type.x');
    assert(pixel_type.y == position.y, 'incorrect pixel_type.y');

    // check timestamp
    assert(timestamp.created_at == starknet::get_block_timestamp(), 'incorrect timestamp.created_at');
    assert(timestamp.updated_at == starknet::get_block_timestamp(), 'incorrect timestamp.updated_at');
    assert(timestamp.x == position.x, 'incorrect timestamp.x');
    assert(timestamp.y == position.y, 'incorrect timestamp.y');
  }
}
