use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use pixelaw::core::models::position::Position;
use pixelaw::core::models::color::Color;

#[starknet::interface]
trait IActions<TContractState> {
    fn init(self: @TContractState);
    fn put_color(self: @TContractState, position: Position, new_color: Color);
    fn remove_color(self: @TContractState, position: Position, player_id: felt252);
}

const APP_KEY: felt252 = 'paint';

#[dojo::contract]
mod actions {
    use starknet::{get_caller_address, get_contract_address};

    use super::IActions;
    use pixelaw::core::models::position::Position;
    use pixelaw::core::models::color::Color;
    use pixelaw::core::models::app::App;
    use pixelaw::core::models::timestamp::Timestamp;
    use pixelaw::core::models::owner::Owner;
    use pixelaw::core::models::alert::Alert;
    use pixelaw::core::models::registry::Registry;
    use pixelaw::core::actions::{
        IActionsDispatcher as ICoreActionsDispatcher,
        IActionsDispatcherTrait as ICoreActionsDispatcherTrait
    };
    use super::APP_KEY;

    // Hardcoded selector of the "remove_color" function
    // FIXME its wrong now.. (i moved Position to first arg)
    const REMOVE_COLOR_SELECTOR: felt252 =
        0x016af38c75fbaa0eb1f1b769bd94962da4e5d65456a470acc8f056e9c20a7d93;

    // impl: implement functions specified in trait
    #[external(v0)]
    impl ActionsImpl of IActions<ContractState> {

        /// Initialize the Paint App (TODO I think, do we need this??)
        fn init(self: @ContractState) {
            let core_actions = Registry::core_actions(self.world_dispatcher.read());

            core_actions.update_app_name(APP_KEY);
        }

        /// Put color on a certain position
        ///
        /// # Arguments
        ///
        /// * `position` - Position of the pixel.
        /// * `new_color` - Color to set the pixel to.
        fn put_color(self: @ContractState, position: Position, new_color: Color) {
            // Load important variables
            let world = self.world_dispatcher.read();
            let core_actions = Registry::core_actions(self.world_dispatcher.read());
            let player: felt252 = get_caller_address().into();

            // Load the Pixel's data
            let (app, timestamp, owner, color, alert) = get!(
                world,
                (position.x, position.y).into(),
                (App, Timestamp, Owner, Color, Alert)
            );

            // If the Pixel is not owned
            if owner.address == 0 {
                // Instantiate a new AllowList
                let mut allowlist: Array<felt252> = ArrayTrait::new();

                // Get the current contract (Paint) address
                let contract_address: felt252 = get_contract_address().into();

                // Add the address to the allowlist. This will ... ???
                allowlist.append(contract_address);

                // Use the PixelawCore action to spawn a pixel with 'paint' pixel type and given allowlist
                core_actions.spawn_pixel(player, position, APP_KEY, allowlist)
            } // If the Pixel was already owned
            else {
                // only check pixel type if pixel has already been spawned
                assert(app.name == APP_KEY, 'App is not paint!')
            }

            // Check if 5 seconds have passed or if the sender is the owner
            assert(
                owner.address == 0 || (owner.address) == player || starknet::get_block_timestamp()
                    - timestamp.updated_at < 5,
                'Cooldown not over'
            );

            // We can now update color of the pixel
            core_actions.update_color(player, position, new_color);

            // If alert was already set, update it

            if alert.value {
                core_actions
                    .update_alert(
                        player,
                        position,
                        Alert { x: position.x, y: position.y, value: false }
                    )
            }

            // The paint app currently "expires" a pixel's color and owner in 10 seconds.
            // This is mainly to demonstrate the queueing system.
            let unlock_time = starknet::get_block_timestamp() + 10;
            let mut calldata: Array<felt252> = ArrayTrait::new();
            calldata.append(player);
            position.serialize(ref calldata);
            core_actions
                .schedule_queue(unlock_time, APP_KEY, REMOVE_COLOR_SELECTOR, calldata.span());
        }

        /// Remove color on a certain position
        ///
        /// # Arguments
        ///
        /// * `position` - Position of the pixel.
        /// * `player_id` - Id of the player calling
        fn remove_color(self: @ContractState, position: Position, player_id: felt252) {
            // Get a handle to core_actions
            let core_actions = Registry::core_actions(self.world_dispatcher.read());

            // Set the color to all 0's (black)
            let new_color = Color { x: position.x, y: position.y, r: 0, g: 0, b: 0 };

            // Call core_actions to update the color
            core_actions.update_color(player_id, position, new_color);

            // Set alert so the player knows something happened
            // TODO do we need this here??
            let alert = Alert { x: position.x, y: position.y, value: true };
            core_actions.update_alert(player_id, position, alert);
        }
    }
}
