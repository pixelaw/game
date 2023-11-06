use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use pixelaw::core::models::pixel::{Pixel, PixelUpdate};

use starknet::{ContractAddress, ClassHash};


#[starknet::interface]
trait IActions<TContractState> {
    fn init(self: @TContractState);
    fn update_app_name(self: @TContractState, name: felt252);
    fn has_write_access(self: @TContractState, for_player: ContractAddress,for_system: ContractAddress,  pixel: Pixel, pixel_update: PixelUpdate,) -> bool;
    fn process_queue(
        self: @TContractState,
        id:felt252,
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
    use pixelaw::core::models::pixel::{Pixel, PixelUpdate};
    use dojo::executor::{IExecutorDispatcher, IExecutorDispatcherTrait};
    use debug::PrintTrait;
    use poseidon::poseidon_hash_span;
    use pixelaw::core::models::queue::{QueueItem};


    #[derive(Drop, starknet::Event)]
    struct QueueScheduled {
        id: felt252,
        timestamp: u64,
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
            'schedule_queue'.print();
            let world = self.world_dispatcher.read();

            // The originator of the transaction
            let caller_account = get_tx_info().unbox().account_contract_address;

            // The address making this call. Has to be a registered App (?)
            let caller_address = get_caller_address();

            // Retrieve the caller system from the address.
            // This prevents non-system addresses to schedule queue
            // let caller_system = get!(world, caller_address, (AppBySystem)).system;

            // let calldata_span = calldata.span();

            // hash the call and store the hash for verification
            let id = poseidon_hash_span(
                array![timestamp.into(), called_system.into(), selector, poseidon_hash_span(calldata)]
                    .span()
            );

            // 'DUMPING'.print();
            // timestamp.print();
            // called_system.print();
            // selector.print();
            // calldata.print();
            // 'DUMPING DONE'.print();

            // Emit the event, so an external scheduler can pick it up
            emit!(world, QueueScheduled { id, timestamp, called_system, selector, calldata: calldata });
            'schedule_queue DONE'.print();
        }


        fn process_queue(
            self: @ContractState,
            id: felt252,
            timestamp: u64,
            called_system: ContractAddress,
            selector: felt252,
            calldata: Span<felt252>
        ) {
            'process_queue'.print();
            let world = self.world_dispatcher.read();
            // A quick check on the timestamp so we know its not too early for this one
            assert(timestamp <= starknet::get_block_timestamp(), 'timestamp still in the future');

            // TODO Do we need a mechanism to ensure that Queued items are really coming from a schedule? 
            // In theory someone can just call this action directly with whatever, as long as the ID is correct it will be executed.
            // It is only possible to call Apps though, so as long as the security of the Apps is okay, it should be fine?
            // And we could add some rate limiting to prevent griefing?
            // 
            // The only way i can think of doing "authentication" of a QueueItem would be to store the ID (hash) onchain, but that gets expensive soon?

            // Recreate the id to check the integrity
            let calculated_id = poseidon_hash_span(
                array![timestamp.into(), called_system.into(), selector, poseidon_hash_span(calldata)]
                    .span()
            );

            // TODO check if id exists onchain

            // Only valid when the queue item was found by the hash
            assert(calculated_id == id, 'Invalid Id');

            // Make the call itself
            starknet::call_contract_syscall(called_system, selector, calldata);

            // Tell the offchain schedulers that this one is done
            emit!(world, QueueProcessed { id });
            'process_queue DONE'.print();
        }


        fn has_write_access(
            self: @ContractState, 
            for_player: ContractAddress,
            for_system: ContractAddress,  
            pixel: Pixel, 
            pixel_update: PixelUpdate
            ) -> bool {
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
            'update_pixel'.print();
            let world = self.world_dispatcher.read();
            let mut pixel = get!(world, (pixel_update.x, pixel_update.y), (Pixel));

            assert(self.has_write_access(for_player,for_system,pixel, pixel_update), 'No access!');

            // If the pixel has no owner set yet, do that now.
            if pixel.owner.is_zero() {
                let now = starknet::get_block_timestamp();

            'for_player'.print();
            for_player.print();


                pixel.owner = for_player;
                pixel.app = for_system;
                pixel.created_at = now;
                pixel.updated_at = now;
            }

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
            'update_pixel DONE'.print();
        }
    }
}
