use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use pixelaw::models::position::Position;
use pixelaw::models::color::Color;
use pixelaw::models::owner::Owner;
use pixelaw::models::text::Text;
use pixelaw::models::pixel_type::PixelType;
use pixelaw::models::needs_attention::NeedsAttention;
use starknet::{ContractAddress, ClassHash};

// trait: specify functions to implement
#[starknet::interface]
trait ICoreActions<TContractState> {
  fn init(self: @TContractState);
  fn update_app_name(self: @TContractState, name: felt252);
  fn has_write_access(self: @TContractState, player_id: felt252, position: Position, caller_system: felt252) -> bool;
  fn process_queue(self: @TContractState, id: u64, class_hash: ClassHash, entry_point: felt252, calldata: Span<felt252>);
  fn schedule_queue(self: @TContractState, unlock: u64, class_hash: ClassHash, entry_point: felt252, calldata: Span<felt252>);
  fn spawn_pixel(self: @TContractState, player_id: felt252, position: Position, pixel_type: felt252, allowlist: Array<felt252>);
  fn update_color(self: @TContractState, player_id: felt252, position: Position, new_color: Color);
  fn update_owner(self: @TContractState, player_id: felt252, position: Position, new_owner: Owner);
  fn update_text(self: @TContractState, player_id: felt252, position: Position, new_text: Text);
  fn update_pixel_type(self: @TContractState, player_id: felt252, position: Position, new_type: PixelType);
  fn update_needs_attention(self: @TContractState, player_id: felt252, position: Position, new_needs_attention: NeedsAttention);
}

#[dojo::contract]
mod core_actions {
  use starknet::{ContractAddress, get_caller_address, ClassHash, get_contract_address};
  use super::ICoreActions;
  use pixelaw::models::owner::Owner;
  use pixelaw::models::app::{App, AppTrait};
  use pixelaw::models::permission::Permission;
  use pixelaw::models::position::Position;
  use pixelaw::models::pixel_type::PixelType;
  use pixelaw::models::timestamp::Timestamp;
  use pixelaw::models::text::Text;
  use pixelaw::models::color::Color;
  use pixelaw::models::needs_attention::NeedsAttention;
  use pixelaw::models::core_actions_model::{CoreActionsModel, KEY};
  use dojo::executor::{IExecutorDispatcher, IExecutorDispatcherTrait};


  #[derive(Drop, starknet::Event)]
  struct QueueStarted {
    id: u64,
    class_hash: ClassHash,
    entry_point: felt252,
    calldata: Span<felt252>
  }

  #[derive(Drop, starknet::Event)]
  struct QueueFinished {
    id: u64
  }

  #[derive(Drop, starknet::Event)]
  struct ColorUpdated {
    color: Color,
    caller: felt252
  }

  #[derive(Drop, starknet::Event)]
  struct OwnerUpdated {
    owner: Owner,
    caller: felt252
  }

  #[derive(Drop, starknet::Event)]
  struct TextUpdated {
    text: Text,
    caller: felt252
  }

  #[derive(Drop, starknet::Event)]
  struct PixelTypeUpdated {
    pixel_type: PixelType,
    caller: felt252
  }

  #[derive(Drop, starknet::Event)]
  struct NeedsAttentionUpdated {
    needs_attention: NeedsAttention,
    caller: felt252
  }

  #[derive(Drop, starknet::Event)]
  struct AppNameUpdated {
    app: App,
    caller: felt252
  }

  #[event]
  #[derive(Drop, starknet::Event)]
  enum Event {
    QueueStarted: QueueStarted,
    QueueFinished: QueueFinished,
    ColorUpdated: ColorUpdated,
    OwnerUpdated: OwnerUpdated,
    TextUpdated: TextUpdated,
    PixelTypeUpdated: PixelTypeUpdated,
    NeedsAttentionUpdated: NeedsAttentionUpdated,
    AppNameUpdated: AppNameUpdated
  }

  fn assert_has_write_access(self: @ContractState, player_id: felt252, position: Position) {
    // Check if the caller is authorized to change the pixel
    let world = self.world_dispatcher.read();
    let system = get!(world, get_caller_address(), (App));
    let has_access = self.has_write_access(player_id, position, system.name);
    assert(has_access, 'Not authorized to change pixel!');
  }

  // impl: implement functions specified in trait
  #[external(v0)]
  impl CoreActionsImpl of ICoreActions<ContractState> {
    // ContractState is defined by system decorator expansion
    fn init(self: @ContractState) {
      let world = self.world_dispatcher.read();
      set!(
        world,
        (
          CoreActionsModel {
            key: KEY,
            value: get_contract_address()
          }
        )
      )
    }

    fn update_app_name(self: @ContractState, name: felt252) {
      let world = self.world_dispatcher.read();
      let system = get_caller_address();
      let app = AppTrait::new(world, system, name);
      emit!(world, AppNameUpdated { app, caller: system.into() });

    }

    fn has_write_access(self: @ContractState, player_id: felt252, position: Position, caller_system: felt252) -> bool {
      let world = self.world_dispatcher.read();

      let permission = get!(world, (position.x, position.y, caller_system).into(), (Permission));
      if permission.allowed {
        return true;
      }

      // If caller is owner or not owned by anyone, allow
      // Retrieve the existing pixel at the specified position
      let owner = get !(world, (position.x, position.y).into(), (Owner));
      owner.address == player_id || owner.address == 0
    }

    fn process_queue(self: @ContractState, id: u64, class_hash: ClassHash, entry_point: felt252, calldata: Span<felt252>) {
      assert(id <= starknet::get_block_timestamp() * 1_000, 'unlock time not passed');
      let world = self.world_dispatcher.read();
      let executor = IExecutorDispatcher { contract_address: world.executor() };
      executor.call(class_hash, entry_point, calldata);
      emit!(world, QueueFinished { id });
    }

    fn schedule_queue(self: @ContractState, unlock: u64, class_hash: ClassHash, entry_point: felt252, calldata: Span<felt252>) {
      let world = self.world_dispatcher.read();
      let random_number = starknet::get_block_timestamp() % 1_000;
      let id = unlock * 1_000 + random_number;

      emit!(
        world,
        QueueStarted {
          id,
          class_hash,
          entry_point,
          calldata
        }
      );
    }

    fn spawn_pixel(self: @ContractState, player_id: felt252, position: Position, pixel_type: felt252, allowlist: Array<felt252>) {
      assert_has_write_access(self, player_id, position);
      let world = self.world_dispatcher.read();

      // Check if the pixel already exists
      let pixel_type = get!(world, (position.x, position.y).into(), (PixelType));
      assert(pixel_type.name == 0, 'Pixel already exists!');


      // Set Pixel components
      set !(
        world,
        (
          Owner {
            x: position.x,
            y: position.y,
            address: player_id
          },
          PixelType {
            x: position.x,
            y: position.y,
            name: pixel_type.name
          },
          Timestamp {
            x: position.x,
            y: position.y,
            created_at: starknet::get_block_timestamp(),
            updated_at: starknet::get_block_timestamp()
          },
        )
      );

      let mut index = 0;
      let len = allowlist.len();
      loop {
        if index == len {
          break;
        }
        set !(
          world, // pixel + system is the storage key
          (
            Permission {
            x: position.x,
            y: position.y,
            caller_system: *allowlist[index],
            allowed: true
            }
          )
        );
        index += 1;
      };
    }

    fn update_color(self: @ContractState, player_id: felt252, position: Position, new_color: Color) {
      assert_has_write_access(self, player_id, position);


      let world = self.world_dispatcher.read();

      // Retrieve the timestamp of the pixel
      let timestamp = get !(world, (position.x, position.y).into(), Timestamp);

      // Update the pixel's color and timestamp in the world state at the specified position
      set !(
        world,
        (
          new_color,
          Timestamp {
            x: position.x,
            y: position.y,
            created_at: timestamp.created_at,
            updated_at: starknet::get_block_timestamp()
          },
        )
      );

      emit!(
        world,
        ColorUpdated {
          color: new_color,
          caller: player_id
        }
      )
    }

    fn update_owner(self: @ContractState, player_id: felt252, position: Position, new_owner: Owner) {
      assert_has_write_access(self, player_id, position);

      let world = self.world_dispatcher.read();

      // Retrieve the timestamp of the pixel
      let timestamp = get !(world, (position.x, position.y).into(), Timestamp);

      // Update the pixel's owner and timestamp in the world state at the specified position
      set !(
        world,
        (
          new_owner,
          Timestamp {
            x: position.x,
            y: position.y,
            created_at: timestamp.created_at, updated_at: starknet::get_block_timestamp()
          },
        )
      );

      emit!(world, OwnerUpdated { owner: new_owner, caller: player_id })
    }

    fn update_text(self: @ContractState, player_id: felt252, position: Position, new_text: Text){
      assert_has_write_access(self, player_id, position);

      let world = self.world_dispatcher.read();

      // Retrieve the timestamp of the pixel
      let timestamp = get !(world, (position.x, position.y).into(), Timestamp);

      // Update the pixel's owner and timestamp in the world state at the specified position
      set !(
        world,
        (
          new_text,
          Timestamp {
            x: position.x,
            y: position.y,
            created_at: timestamp.created_at,
            updated_at: starknet::get_block_timestamp()
          },
        )
      );

      emit!(world, TextUpdated { text: new_text, caller: player_id })
    }

    fn update_pixel_type(self: @ContractState, player_id: felt252, position: Position, new_type: PixelType) {
      assert_has_write_access(self, player_id, position);
      let world = self.world_dispatcher.read();

      // Retrieve the timestamp of the pixel
      let timestamp = get !(world, (position.x, position.y).into(), Timestamp);

      // Update the pixel's owner and timestamp in the world state at the specified position
      set !(
        world,
        (
          new_type,
          Timestamp {
            x: position.x,
            y: position.y,
            created_at: timestamp.created_at,
            updated_at: starknet::get_block_timestamp()
        },
        )
      );

      emit!(world, PixelTypeUpdated { pixel_type: new_type, caller: player_id })
    }

    fn update_needs_attention(self: @ContractState, player_id: felt252, position: Position, new_needs_attention: NeedsAttention) {
      assert_has_write_access(self, player_id, position);

      let world = self.world_dispatcher.read();

      // Retrieve the timestamp of the pixel
      let timestamp = get !(world, (position.x, position.y).into(), Timestamp);

      // Update the pixel's owner and timestamp in the world state at the specified position
      set !(
        world,
        (
          new_needs_attention,
          Timestamp {
          x: position.x,
          y: position.y,
          created_at: timestamp.created_at,
          updated_at: starknet::get_block_timestamp()
          },
        )
      );

      emit!(world, NeedsAttentionUpdated { needs_attention: new_needs_attention, caller: player_id })
    }

  }
}

#[cfg(test)]
mod tests {
  use starknet::class_hash::Felt252TryIntoClassHash;

  use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

  use dojo::test_utils::{spawn_test_world, deploy_contract};

  use pixelaw::models::owner::Owner;
  use pixelaw::models::owner::owner;
  use pixelaw::models::permission::Permission;
  use pixelaw::models::permission::permission;
  use pixelaw::models::position::Position;
  use pixelaw::models::pixel_type::PixelType;
  use pixelaw::models::pixel_type::pixel_type;
  use pixelaw::models::timestamp::Timestamp;
  use pixelaw::models::timestamp::timestamp;
  use pixelaw::models::text::Text;
  use pixelaw::models::text::text;
  use pixelaw::models::color::Color;
  use pixelaw::models::color::color;

  use super::{core_actions, ICoreActionsDispatcher, ICoreActionsDispatcherTrait};

  const SPAWN_PIXEL_ENTRYPOINT: felt252 = 0x01c199924ae2ed5de296007a1ac8aa672140ef2a973769e4ad1089829f77875a;

  #[test]
  #[available_gas(30000000)]
  fn test_process_queue() {
    let caller = starknet::contract_address_const::<0x0>();

    // models
    let mut models = array![
      owner::TEST_CLASS_HASH,
      permission::TEST_CLASS_HASH,
      pixel_type::TEST_CLASS_HASH,
      timestamp::TEST_CLASS_HASH,
      text::TEST_CLASS_HASH,
      color::TEST_CLASS_HASH,
    ];
    // deploy world with models
    let world = spawn_test_world(models);

    // deploy systems contract
    let contract_address = world
      .deploy_contract(0, core_actions::TEST_CLASS_HASH.try_into().unwrap());

    let core_actions_system = ICoreActionsDispatcher { contract_address };
    let id = 0;

    let position = Position {
      x: 0,
      y: 0
    };

    let mut calldata: Array<felt252> = ArrayTrait::new();
    calldata.append('snake');
    position.serialize(ref calldata);
    calldata.append('snake');
    calldata.append(0);


    core_actions_system.process_queue(
      id,
      core_actions::TEST_CLASS_HASH.try_into().unwrap(),
      SPAWN_PIXEL_ENTRYPOINT,
      calldata.span()
    );
  }
}
