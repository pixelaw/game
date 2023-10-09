use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use pixelaw::models::position::Position;
use pixelaw::models::color::Color;
use starknet::{ContractAddress, ClassHash};

// trait: specify functions to implement
#[starknet::interface]
trait ICoreActions<TContractState> {
  fn has_write_access(self: @TContractState, position: Position, caller_system: felt252) -> bool;
  fn process_queue(self: @TContractState, id: u64, class_hash: ClassHash, entry_point: felt252, calldata: Span<felt252>);
  fn schedule_queue(self: @TContractState, unlock: u64, class_hash: ClassHash, entry_point: felt252, calldata: Span<felt252>);
}

#[system]
mod core_actions {
  use starknet::{ContractAddress, get_caller_address, ClassHash};
  use super::ICoreActions;
  use pixelaw::models::owner::Owner;
  use pixelaw::models::permission::Permission;
  use pixelaw::models::position::Position;
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

  #[event]
  #[derive(Drop, starknet::Event)]
  enum Event {
    QueueStarted: QueueStarted,
    QueueFinished: QueueFinished
  }

  // impl: implement functions specified in trait
  #[external(v0)]
  impl CoreActionsImpl of ICoreActions<ContractState> {
    // ContractState is defined by system decorator expansion
    fn has_write_access(self: @ContractState, position: Position, caller_system: felt252) -> bool {
      let world = IWorldDispatcher { contract_address: self.world_dispatcher.read() };

      let permission = get!(world, (position.x, position.y, caller_system).into(), (Permission));
      if permission.allowed {
        return true;
      }

      // If caller is owner or not owned by anyone, allow
      // Retrieve the existing pixel at the specified position
      let owner = get !(world, (position.x, position.y).into(), (Owner));
      let origin: felt252 = get_caller_address().into();
      owner.address == origin || owner.address == 0
    }

    fn process_queue(self: @ContractState, id: u64, class_hash: ClassHash, entry_point: felt252, calldata: Span<felt252>) {
      assert(id <= starknet::get_block_timestamp() * 1_000, 'unlock time not passed');
      let world = IWorldDispatcher { contract_address: self.world_dispatcher.read() };
      let executor = IExecutorDispatcher { contract_address: world.executor() };
      executor.call(class_hash, entry_point, calldata);
      emit!(world, Event::QueueFinished(QueueFinished { id }));
    }

    fn schedule_queue(self: @ContractState, unlock: u64, class_hash: ClassHash, entry_point: felt252, calldata: Span<felt252>) {
      let world = IWorldDispatcher { contract_address: self.world_dispatcher.read() };
      let random_number = starknet::get_block_timestamp() % 1_000;
      let id = unlock * 1_000 + random_number;

      emit!(
        world,
        Event::QueueStarted(QueueStarted {
          id,
          class_hash,
          entry_point,
          calldata
        })
      );
    }

  }
}
