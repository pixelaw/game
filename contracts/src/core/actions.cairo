use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use pixelaw::core::models::pixel::Position;
use pixelaw::core::models::pixel::Color;
use pixelaw::core::models::pixel::Pixel;

use starknet::{ContractAddress, ClassHash};


// trait: specify functions to implement
#[starknet::interface]
trait IActions<TContractState> {
    fn init(self: @TContractState);
    // fn update_app_name(self: @TContractState, name: felt252);
    fn has_write_access(
        self: @TContractState,
        pixel: Pixel,
        alert: Option<felt252>,
        app: Option<ContractAddress>,
        color: Option<Color>,
        owner: Option<ContractAddress>,
        text: Option<felt252>,
        timestamp: Option<u64>
    ) -> bool;
    // fn process_queue(
    //     self: @TContractState,
    //     id: u64,
    //     system: ContractAddress,
    //     selector: felt252,
    //     calldata: Span<felt252>
    // );
    // fn schedule_queue(
    //     self: @TContractState,
    //     unlock: u64,
    //     system: felt252,
    //     selector: felt252,
    //     calldata: Span<felt252>
    // );
    fn update_pixel(
        self: @TContractState,
        position: Position,
        alert: Option<felt252>,
        app: Option<ContractAddress>,
        color: Option<Color>,
        owner: Option<ContractAddress>,
        text: Option<felt252>,
        timestamp: Option<u64>
    );
// fn update_color(
//     self: @TContractState, player_id: felt252, position: Position, new_color: Color
// );
// fn update_owner(
//     self: @TContractState, player_id: felt252, position: Position, new_owner: Owner
// );
// fn update_text(self: @TContractState, player_id: felt252, position: Position, new_text: Text);
// fn update_app(self: @TContractState, player_id: felt252, position: Position, new_type: App);
// fn update_alert(
//     self: @TContractState, player_id: felt252, position: Position, new_alert: Alert
// );
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
    use pixelaw::core::models::pixel::Position;
    use pixelaw::core::models::pixel::Color;
    use pixelaw::core::models::pixel::Pixel;
    use dojo::executor::{IExecutorDispatcher, IExecutorDispatcherTrait};
    use debug::PrintTrait;

    #[derive(Drop, starknet::Event)]
    struct QueueStarted {
        id: u64,
        system: ContractAddress,
        selector: felt252,
        calldata: Span<felt252>
    }

    #[derive(Drop, starknet::Event)]
    struct QueueFinished {
        id: u64
    }

    #[derive(Drop, starknet::Event)]
    struct AppNameUpdated {
        app: AppBySystem,
        caller: felt252
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        QueueStarted: QueueStarted,
        QueueFinished: QueueFinished,
        AppNameUpdated: AppNameUpdated
    }


    #[external(v0)]
    impl ActionsImpl of IActions<ContractState> {
        /// Initializes the Pixelaw actions model
        fn init(self: @ContractState) {
            let world = self.world_dispatcher.read();
            Registry::set_core_actions_address(world, get_contract_address());
        }


        //
        // /// Updates the name of an app in the registry
        // ///
        // /// # Arguments
        // ///
        // /// * `name` - The new name of the app
        // fn update_app_name(self: @ContractState, name: felt252) {
        //     let world = self.world_dispatcher.read();
        //     let system = get_caller_address();
        //     let app = Registry::new_app(world, system, name);
        //     emit!(world, AppNameUpdated { app, caller: system.into() });
        // }

        //
        // /// Schedules an item on the queue
        // ///
        // /// # Arguments
        // ///
        // /// * `unlock` - Number of seconds in the future to enable execution (delay) this queue item
        // /// * `system` - The Contract to be executed on
        // /// * `selector` - The selector of the function to be executed
        // /// * `calldata` - Optional calldata for the function call
        // fn schedule_queue(
        //     self: @ContractState,
        //     unlock: u64,
        //     system: felt252,
        //     selector: felt252,
        //     calldata: Span<felt252>
        // ) {
        //     let world = self.world_dispatcher.read();
        //     let random_number = starknet::get_block_timestamp() % 1_000;
        //     let id = unlock * 1_000 + random_number;
        //     let app_name = get!(world, system, (AppByName));
        //
        //     // TODO check permissions
        //
        //     // TODO hash the call and store the hash for verification
        //
        //     emit!(world, QueueStarted { id, system: app_name.system, selector, calldata });
        // }
        //
        //
        // /// Executes an item from the queue
        // ///
        // /// # Arguments
        // ///
        // /// * `id` - Queue id (TODO: explain how it relates to a timestamp)
        // /// * `system` - The Contract to be executed on
        // /// * `selector` - The selector of the function to be executed
        // /// * `calldata` - Optional calldata for the function call
        // fn process_queue(
        //     self: @ContractState,
        //     id: u64,
        //     system: ContractAddress,
        //     selector: felt252,
        //     calldata: Span<felt252>
        // ) {
        //     assert(id <= starknet::get_block_timestamp() * 1_000, 'unlock time not passed');
        //     starknet::call_contract_syscall(system, selector, calldata);
        //     let world = self.world_dispatcher.read();
        //     emit!(world, QueueFinished { id });
        // }

        fn has_write_access(
            self: @ContractState,
            pixel: Pixel,
            alert: Option<felt252>,
            app: Option<ContractAddress>,
            color: Option<Color>,
            owner: Option<ContractAddress>,
            text: Option<felt252>,
            timestamp: Option<u64>
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

            // The caller_address is a System, let's see if it has access

            // Retrieve the App of the calling System
            let caller_app = get!(world, get_caller_address(), (AppBySystem));

            // TODO decide whether an App by default has write on a pixel with same App?
            let permissions = get!(world, (pixel.app, caller_app.system).into(), (Permissions));

            if alert.is_some() {
                assert(permissions.permission.alert, 'Cannot update alert')
            };
            if app.is_some() {
                assert(permissions.permission.app, 'Cannot update app')
            };
            if color.is_some() {
                assert(permissions.permission.color, 'Cannot update color')
            };
            if owner.is_some() {
                assert(permissions.permission.owner, 'Cannot update owner')
            };
            if text.is_some() {
                assert(permissions.permission.text, 'Cannot update text')
            };
            if timestamp.is_some() {
                assert(permissions.permission.timestamp, 'Cannot update timestamp')
            };

            // Since we checked all the permissions and no assert fired, we can return true
            true
        }


        fn update_pixel(
            self: @ContractState,
            position: Position,
            alert: Option<felt252>,
            app: Option<ContractAddress>,
            color: Option<Color>,
            owner: Option<ContractAddress>,
            text: Option<felt252>,
            timestamp: Option<u64>
        ) {
            let world = self.world_dispatcher.read();
            let mut pixel = get!(world, (position).into(), (Pixel));

            assert(
                self.has_write_access(pixel, alert, app, color, owner, text, timestamp),
                'No access!'
            );

            if alert.is_some() {
                pixel.alert = alert.unwrap();
            }

            if app.is_some() {
                pixel.app = app.unwrap();
            }

            if color.is_some() {
                pixel.color = color.unwrap();
            }

            if owner.is_some() {
                pixel.owner = owner.unwrap();
            }

            if text.is_some() {
                pixel.text = text.unwrap();
            }

            if timestamp.is_some() {
                pixel.timestamp = timestamp.unwrap();
            }

            // Set Pixel
            set!(world, (pixel));
        }
    }
}
