use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use pixelaw::core::models::position::Position;
use pixelaw::core::models::color::Color;

#[starknet::interface]
trait IActions<TContractState> {
  fn init(self: @TContractState);
  fn put_color(self: @TContractState, position: Position, new_color: Color);
  fn remove_color(self: @TContractState, player_id: felt252, position: Position);
}

const PIXEL_TYPE: felt252 = 'paint';

#[dojo::contract]
mod actions {
  use starknet::{get_caller_address, get_contract_address};

  use super::IActions;
  use pixelaw::core::models::position::Position;
  use pixelaw::core::models::color::Color;
  use pixelaw::core::models::pixel_type::PixelType;
  use pixelaw::core::models::timestamp::Timestamp;
  use pixelaw::core::models::owner::Owner;
  use pixelaw::core::models::needs_attention::NeedsAttention;
  use pixelaw::core::models::actions_model::ActionsModelTrait;
  use pixelaw::core::actions::{ 
    IActionsDispatcher as ICoreActionsDispatcher, 
    IActionsDispatcherTrait as ICoreActionsDispatcherTrait
    };
  use super::PIXEL_TYPE;

  const REMOVE_COLOR_ENTRYPOINT: felt252 = 0x016af38c75fbaa0eb1f1b769bd94962da4e5d65456a470acc8f056e9c20a7d93;

  fn actions_system(self: @ContractState) -> ICoreActionsDispatcher {
    let world = self.world_dispatcher.read();
    let actions_address = ActionsModelTrait::address(world);
    ICoreActionsDispatcher { contract_address: actions_address }
  }

  // impl: implement functions specified in trait
  #[external(v0)]
  impl ActionsImpl of IActions<ContractState> {

    fn init(self: @ContractState) {
      let actions_system = actions_system(self);
      actions_system.update_app_name(PIXEL_TYPE);
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

      let actions_system = actions_system(self);

      let player: felt252 = get_caller_address().into();

      if owner.address == 0 {
        let mut allowlist: Array<felt252> = ArrayTrait::new();
        let contract_address: felt252 = get_contract_address().into();
        allowlist.append(contract_address);
        actions_system.spawn_pixel(player, position, PIXEL_TYPE, allowlist)
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

      actions_system.update_color(player, position, new_color);

      if needs_attention.value {
        actions_system.update_needs_attention(
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
      let mut calldata: Array<felt252> = ArrayTrait::new();
      calldata.append(player);
      position.serialize(ref calldata);
      actions_system.schedule_queue(
        unlock_time,
        PIXEL_TYPE,
        REMOVE_COLOR_ENTRYPOINT,
        calldata.span());
    }

    fn remove_color(self: @ContractState, player_id: felt252, position: Position){
      let actions_system = actions_system(self);

      let removed_color = Color {
        x: position.x,
        y: position.y,
        r: 0,
        g: 0,
        b: 0
      };
      actions_system.update_color(player_id, position, removed_color);

      let needs_attention = NeedsAttention {
        x: position.x,
        y: position.y,
        value: true
      };
      actions_system.update_needs_attention(player_id, position, needs_attention);
    }
  }
}
