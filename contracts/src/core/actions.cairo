use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use pixelaw::core::models::position::Position;
use pixelaw::core::models::color::Color;
use pixelaw::core::models::owner::Owner;
use pixelaw::core::models::text::Text;
use pixelaw::core::models::app::App;
use pixelaw::core::models::alert::Alert;
use starknet::{ContractAddress, ClassHash};

// trait: specify functions to implement
#[starknet::interface]
trait IActions<TContractState> {
    fn init(self: @TContractState);
    fn update_app_name(self: @TContractState, name: felt252);
    fn has_write_access(
        self: @TContractState, player_id: felt252, position: Position, caller_system: felt252
    ) -> bool;
    fn process_queue(
        self: @TContractState,
        id: u64,
        system: ContractAddress,
        selector: felt252,
        calldata: Span<felt252>
    );
    fn schedule_queue(
        self: @TContractState,
        unlock: u64,
        system: felt252,
        selector: felt252,
        calldata: Span<felt252>
    );
    fn spawn_pixel(
        self: @TContractState,
        player_id: felt252,
        position: Position,
        app: felt252,
        allowlist: Array<felt252>
    );
    fn update_color(
        self: @TContractState, player_id: felt252, position: Position, new_color: Color
    );
    fn update_owner(
        self: @TContractState, player_id: felt252, position: Position, new_owner: Owner
    );
    fn update_text(self: @TContractState, player_id: felt252, position: Position, new_text: Text);
    fn update_app(
        self: @TContractState, player_id: felt252, position: Position, new_type: App
    );
    fn update_alert(
        self: @TContractState,
        player_id: felt252,
        position: Position,
        new_alert: Alert
    );
}


#[dojo::contract]
mod actions {
    use starknet::{ContractAddress, get_caller_address, ClassHash, get_contract_address};
    use super::IActions;
    use pixelaw::core::models::owner::Owner;
    use pixelaw::core::models::registry::{AppBySystem, AppByName, Registry};
    use pixelaw::core::models::permission::Permission;
    use pixelaw::core::models::position::Position;
    use pixelaw::core::models::app::App;
    use pixelaw::core::models::timestamp::Timestamp;
    use pixelaw::core::models::text::Text;
    use pixelaw::core::models::color::Color;
    use pixelaw::core::models::alert::Alert;
    use dojo::executor::{IExecutorDispatcher, IExecutorDispatcherTrait};


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
    struct AppUpdated {
        app: App,
        caller: felt252
    }

    #[derive(Drop, starknet::Event)]
    struct AlertUpdated {
        alert: Alert,
        caller: felt252
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
        ColorUpdated: ColorUpdated,
        OwnerUpdated: OwnerUpdated,
        TextUpdated: TextUpdated,
        AppUpdated: AppUpdated,
        AlertUpdated: AlertUpdated,
        AppNameUpdated: AppNameUpdated
    }

    fn assert_has_write_access(self: @ContractState, player_id: felt252, position: Position) {
        // Check if the caller is authorized to change the pixel
        let world = self.world_dispatcher.read();
        let app_by_system = get!(world, get_caller_address(), (AppBySystem));
        let has_access = self.has_write_access(player_id, position, app_by_system.name);
        assert(has_access, 'Not authorized to change pixel!');
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

        /// Returns whether a given caller has write access to a position
        ///
        /// # Arguments
        ///
        /// * `player_id` - Id of the calling player
        /// * `position` - The Position being queried
        /// * `caller_system` - System ID of the caller (if not a player)
        ///
        /// # Returns
        ///
        /// * `bool` - Has write access or not
        fn has_write_access(
            self: @ContractState, player_id: felt252, position: Position, caller_system: felt252
        ) -> bool {
            let world = self.world_dispatcher.read();

            let permission = get!(
                world, (position.x, position.y, caller_system).into(), (Permission)
            );
            if permission.allowed {
                return true;
            }

            // If caller is owner or not owned by anyone, allow
            // Retrieve the existing pixel at the specified position
            let owner = get!(world, (position.x, position.y).into(), (Owner));
            owner.address == player_id || owner.address == 0
        }

        /// Executes an item from the queue
        ///
        /// # Arguments
        ///
        /// * `id` - Queue id (TODO: explain how it relates to a timestamp)
        /// * `system` - The Contract to be executed on
        /// * `selector` - The selector of the function to be executed
        /// * `calldata` - Optional calldata for the function call
        fn process_queue(
            self: @ContractState,
            id: u64,
            system: ContractAddress,
            selector: felt252,
            calldata: Span<felt252>
        ) {
            assert(id <= starknet::get_block_timestamp() * 1_000, 'unlock time not passed');
            starknet::call_contract_syscall(system, selector, calldata);
            let world = self.world_dispatcher.read();
            emit!(world, QueueFinished { id });
        }


        /// Schedules an item on the queue
        ///
        /// # Arguments
        ///
        /// * `unlock` - Number of seconds in the future to enable execution (delay) this queue item
        /// * `system` - The Contract to be executed on
        /// * `selector` - The selector of the function to be executed
        /// * `calldata` - Optional calldata for the function call
        fn schedule_queue(
            self: @ContractState,
            unlock: u64,
            system: felt252,
            selector: felt252,
            calldata: Span<felt252>
        ) {
            let world = self.world_dispatcher.read();
            let random_number = starknet::get_block_timestamp() % 1_000;
            let id = unlock * 1_000 + random_number;
            let app_name = get!(world, system, (AppByName));

            emit!(world, QueueStarted { id, system: app_name.system, selector, calldata });
        }


        /// Spawn a pixel
        ///
        /// # Arguments
        ///
        /// * `player_id` - Player ID spawning
        /// * `position` - Position of the Pixel being spawned
        /// * `app` - Type of the pixel
        /// * `allowlist` - Allowlist for the pixel
        fn spawn_pixel(
            self: @ContractState,
            player_id: felt252,
            position: Position,
            app: felt252,
            allowlist: Array<felt252>
        ) {
            assert_has_write_access(self, player_id, position);
            let world = self.world_dispatcher.read();

            // Check if the pixel already exists
            let current_app = get!(world, (position.x, position.y).into(), (App));
            assert(current_app.name == 0, 'Pixel already exists!');

            // Set Pixel components
            set!(
                world,
                (
                    Owner { x: position.x, y: position.y, address: player_id },
                    App { x: position.x, y: position.y, name: app },
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
                set!(
                    world, // pixel + system is the storage key
                    (Permission {
                        x: position.x,
                        y: position.y,
                        caller_system: *allowlist[index],
                        allowed: true
                    })
                );
                index += 1;
            };
        }

        /// Update color of a pixel
        ///
        /// # Arguments
        ///
        /// * `player_id` - Player ID
        /// * `position` - Position of the Pixel being changed
        /// * `new_color` - New color
        fn update_color(
            self: @ContractState,
            player_id: felt252,
            position: Position,
            new_color: Color
        ) {
            assert_has_write_access(self, player_id, position);

            let world = self.world_dispatcher.read();

            // Retrieve the timestamp of the pixel
            let timestamp = get!(world, (position.x, position.y).into(), Timestamp);

            // Update the pixel's color and timestamp in the world state at the specified position
            set!(
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

            emit!(world, ColorUpdated { color: new_color, caller: player_id })
        }

        /// Update owner of a pixel
        ///
        /// # Arguments
        ///
        /// * `player_id` - Player ID
        /// * `position` - Position of the Pixel being changed
        /// * `new_owner` - New owner
        fn update_owner(
            self: @ContractState, player_id: felt252, position: Position, new_owner: Owner
        ) {
            assert_has_write_access(self, player_id, position);

            let world = self.world_dispatcher.read();

            // Retrieve the timestamp of the pixel
            let timestamp = get!(world, (position.x, position.y).into(), Timestamp);

            // Update the pixel's owner and timestamp in the world state at the specified position
            set!(
                world,
                (
                    new_owner,
                    Timestamp {
                        x: position.x,
                        y: position.y,
                        created_at: timestamp.created_at,
                        updated_at: starknet::get_block_timestamp()
                    },
                )
            );

            emit!(world, OwnerUpdated { owner: new_owner, caller: player_id })
        }

        /// Update text of a pixel
        ///
        /// # Arguments
        ///
        /// * `player_id` - Player ID
        /// * `position` - Position of the Pixel being changed
        /// * `new_text` - New text
        fn update_text(
            self: @ContractState, player_id: felt252, position: Position, new_text: Text
        ) {
            assert_has_write_access(self, player_id, position);

            let world = self.world_dispatcher.read();

            // Retrieve the timestamp of the pixel
            let timestamp = get!(world, (position.x, position.y).into(), Timestamp);

            // Update the pixel's owner and timestamp in the world state at the specified position
            set!(
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

        /// Update app of a pixel
        ///
        /// # Arguments
        ///
        /// * `player_id` - Player ID
        /// * `position` - Position of the Pixel being changed
        /// * `new_type` - New app
        fn update_app(
            self: @ContractState, player_id: felt252, position: Position, new_type: App
        ) {
            assert_has_write_access(self, player_id, position);
            let world = self.world_dispatcher.read();

            // Retrieve the timestamp of the pixel
            let timestamp = get!(world, (position.x, position.y).into(), Timestamp);

            // Update the pixel's owner and timestamp in the world state at the specified position
            set!(
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

            emit!(world, AppUpdated { app: new_type, caller: player_id })
        }

        /// Update Alert of a Pixel
        ///
        /// # Arguments
        ///
        /// * `player_id` - Player ID
        /// * `position` - Position of the Pixel being changed
        /// * `new_alert` - new_alert
        fn update_alert(
            self: @ContractState,
            player_id: felt252,
            position: Position,
            new_alert: Alert
        ) {
            assert_has_write_access(self, player_id, position);

            let world = self.world_dispatcher.read();

            // Retrieve the timestamp of the pixel
            let timestamp = get!(world, (position.x, position.y).into(), Timestamp);

            // Update the pixel's owner and timestamp in the world state at the specified position
            set!(
                world,
                (
                    new_alert,
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
                AlertUpdated { alert: new_alert, caller: player_id }
            )
        }
    }
}
