use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use pixelaw::core::models::pixel::{Pixel, PixelUpdate, Color, Position};

use starknet::{ContractAddress, ClassHash};


#[starknet::interface]
trait IActions<TContractState> {
    fn init(self: @TContractState);
    fn update_app_name(self: @TContractState, name: felt252);
    fn has_write_access(self: @TContractState, for_player: ContractAddress,for_system: ContractAddress,  pixel: Pixel, pixel_update: PixelUpdate,) -> bool;
    fn process_queue(
        self: @TContractState,
        timestamp: u64,
        called_system: ContractAddress,
        selector: felt252,
        calldata: Span<felt252>
    );
    fn schedule_queue(
        self: @TContractState,
        timestamp: u64,
        called_system: ContractAddress,
        selector: felt252,
        calldata: Span<felt252>
    );
    fn update_pixel(self: @TContractState, for_player: ContractAddress, for_system: ContractAddress,  pixel_update: PixelUpdate);
}


#[dojo::contract]
mod actions {
    use starknet::{
        ContractAddress, get_caller_address, ClassHash, get_contract_address, get_tx_info
    };
    use starknet::info::TxInfo;
    use super::IActions;
    use pixelaw::core::models::registry::{AppBySystem, AppByName, Registry};
    use pixelaw::core::models::permissions::{Permission, Permissions};
    use pixelaw::core::models::pixel::{Pixel, PixelUpdate, Color, Position};
    use dojo::executor::{IExecutorDispatcher, IExecutorDispatcherTrait};
    use debug::PrintTrait;
    use poseidon::poseidon_hash_span;
    use pixelaw::core::models::queue::{QueueItem};



    #[derive(Drop, starknet::Event)]
    struct QueueScheduled {
        timestamp: u64,
        id: felt252,
        caller_system: ContractAddress,
        called_system: ContractAddress,
        selector: felt252,
        calldata: Span<felt252>
    }

    #[derive(Drop, starknet::Event)]
    struct QueueProcessed {
        id: felt252
    }

    #[derive(Drop, starknet::Event)]
    struct AppNameUpdated {
        app: AppBySystem,
        caller: felt252
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        QueueScheduled: QueueScheduled,
        QueueProcessed: QueueProcessed,
        AppNameUpdated: AppNameUpdated
    }


    #[external(v0)]
    impl ActionsImpl of IActions<ContractState> {
        /// Initializes the Pixelaw actions model
        fn init(self: @ContractState) {
            let world = self.world_dispatcher.read();
            Registry::set_core_actions_address(world, get_contract_address());
        }


        /// Updates the name of an app in the registry
        ///
        /// # Arguments
        ///
        /// * `name` - The new name of the app
        fn update_app_name(self: @ContractState, name: felt252) {
            let world = self.world_dispatcher.read();
            let system = get_caller_address();
            let app = Registry::new_app(world, system, name);
            emit!(world, AppNameUpdated { app, caller: system.into() });
        }


        fn schedule_queue(
            self: @ContractState,
            timestamp: u64,
            called_system: ContractAddress,
            selector: felt252,
            calldata: Span<felt252>
        ) {
            let world = self.world_dispatcher.read();

            // The originator of the transaction
            let caller_account = get_tx_info().unbox().account_contract_address;

            // The address making this call. Has to be a registered App (?)
            let caller_address = get_caller_address();

            // Retrieve the caller system from the address.
            // This prevents non-system addresses to schedule queue
            let caller_system = get!(world, caller_address, (AppBySystem)).system;


            // hash the call and store the hash for verification
            let id = poseidon_hash_span(
                array![timestamp.into(), caller_system.into(), called_system.into(), selector, poseidon_hash_span(calldata)]
                    .span()
            );

            // Store the hash with the caller address
            set!(world, QueueItem{id, valid: true});

            // Emit the event, so an external scheduler can pick it up
            emit!(world, QueueScheduled { id, timestamp, caller_system, called_system, selector, calldata });
        }


        fn process_queue(
            self: @ContractState,
            timestamp: u64,
            called_system: ContractAddress,
            selector: felt252,
            calldata: Span<felt252>
        ) {
            let world = self.world_dispatcher.read();
            // A quick check on the timestamp so we know its not too early for this one
            assert(timestamp <= starknet::get_block_timestamp(), 'timestamp still in the future');

            // Recreate the id to check the integrity
            let id = poseidon_hash_span(
                array![timestamp.into(), called_system.into(), selector, poseidon_hash_span(calldata)]
                    .span()
            );

            // Try to retrieve the queue_item based on its id
            let queue_item = get!(world, id, (QueueItem));

            // Only valid when the queue item was found by the hash
            assert(queue_item.valid, 'Invalid QueueItem');



            // Make the call itself
            starknet::call_contract_syscall(called_system, selector, calldata);

            // Remove the QueueItem (hoping this is how storage gets freed up?)
            // TODO this may be wrong..
            set!(world, QueueItem{id, valid: false});

            // Tell the offchain schedulers that this one is done
            emit!(world, QueueProcessed { id });
        }


        fn has_write_access(self: @ContractState, for_player: ContractAddress,for_system: ContractAddress,  pixel: Pixel, pixel_update: PixelUpdate) -> bool {
            let world = self.world_dispatcher.read();

            // The originator of the transaction
            let caller_account = get_tx_info().unbox().account_contract_address;

            // The address making this call. Could be a System of an App
            let caller_address = get_caller_address();

            // First check: Can we grant based on ownership?
            // If caller is owner or not owned by anyone, allow
            if pixel.owner == caller_account || pixel.owner.is_zero() {
                return true;
            } else if caller_account == caller_address {
                // The caller is not a System, and not owner, so no reason to keep looking.
                return false;
            }

            // Deal with Scheduler calling

            // The caller_address is a System, let's see if it has access

            // Retrieve the App of the calling System
            let caller_app = get!(world, get_caller_address(), (AppBySystem));

            // TODO decide whether an App by default has write on a pixel with same App?
            let permissions = get!(world, (pixel.app, caller_app.system).into(), (Permissions));

            if pixel_update.alert.is_some() {
                assert(permissions.permission.alert, 'Cannot update alert')
            };
            if pixel_update.app.is_some() {
                assert(permissions.permission.app, 'Cannot update app')
            };
            if pixel_update.color.is_some() {
                assert(permissions.permission.color, 'Cannot update color')
            };
            if pixel_update.owner.is_some() {
                assert(permissions.permission.owner, 'Cannot update owner')
            };
            if pixel_update.text.is_some() {
                assert(permissions.permission.text, 'Cannot update text')
            };
            if pixel_update.timestamp.is_some() {
                assert(permissions.permission.timestamp, 'Cannot update timestamp')
            };

            // Since we checked all the permissions and no assert fired, we can return true
            true
        }


        fn update_pixel(self: @ContractState, for_player: ContractAddress, for_system: ContractAddress, pixel_update: PixelUpdate) {
            let world = self.world_dispatcher.read();
            let mut pixel = get!(world, (pixel_update.position).into(), (Pixel));

            assert(self.has_write_access(for_player,for_system,pixel, pixel_update), 'No access!');

            if pixel_update.alert.is_some() {
                pixel.alert = pixel_update.alert.unwrap();
            }

            if pixel_update.app.is_some() {
                pixel.app = pixel_update.app.unwrap();
            }

            if pixel_update.color.is_some() {
                pixel.color = pixel_update.color.unwrap();
            }

            if pixel_update.owner.is_some() {
                pixel.owner = pixel_update.owner.unwrap();
            }

            if pixel_update.text.is_some() {
                pixel.text = pixel_update.text.unwrap();
            }

            if pixel_update.timestamp.is_some() {
                pixel.timestamp = pixel_update.timestamp.unwrap();
            }

            // Set Pixel
            set!(world, (pixel));
        }
    }
}
