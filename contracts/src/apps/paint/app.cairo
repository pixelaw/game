use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use pixelaw::core::models::pixel::{Pixel, PixelUpdate, Color, Position};

#[starknet::interface]
trait IActions<TContractState> {
    fn init(self: @TContractState);
    fn put_color(self: @TContractState, position: Position, color: Color);
    fn remove_color(self: @TContractState, position: Position);
}

const APP_KEY: felt252 = 'paint';

#[dojo::contract]
mod paint_actions {
    use starknet::{get_caller_address, get_contract_address};

    use super::IActions;
    use pixelaw::core::models::pixel::{Pixel, PixelUpdate, Color, Position};

    use pixelaw::core::models::registry::Registry;
    use pixelaw::core::actions::{
        IActionsDispatcher as ICoreActionsDispatcher,
        IActionsDispatcherTrait as ICoreActionsDispatcherTrait
    };
    use super::APP_KEY;
    use debug::PrintTrait;

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
        fn put_color(self: @ContractState, position: Position, color: Color) {
            'put_color'.print();

            // Load important variables
            let world = self.world_dispatcher.read();
            let core_actions = Registry::core_actions(self.world_dispatcher.read());
            let player = get_caller_address();

            // Load the Pixel
            let mut pixel = get!(world, (position).into(), (Pixel));


            // TODO: Load Paint App Settings 
            // For example for the Cooldown feature
            let COOLDOWN_SECS = 5;

            // Check if 5 seconds have passed or if the sender is the owner
            // TODO error message confusing, have to split this
            assert(
                pixel.owner.is_zero() || (pixel.owner) == player || starknet::get_block_timestamp()
                    - pixel.timestamp < COOLDOWN_SECS,
                'Cooldown not over'
            );



            // We can now update color of the pixel
            core_actions.update_pixel(PixelUpdate {
                position, 
                color: Option::Some(color), 
                alert: Option::None, 
                timestamp: Option::None, 
                text: Option::None, 
                app: Option::None, 
                owner: Option::None 
            } );


            // The paint app currently "expires" a pixel's color and owner in 10 seconds.
            // This is mainly to demonstrate the queueing system.
            let unlock_time = starknet::get_block_timestamp() + 10;
            let mut calldata: Array<felt252> = ArrayTrait::new();
            calldata.append(player.into());
            position.serialize(ref calldata);
            core_actions
                .schedule_queue(unlock_time, APP_KEY, REMOVE_COLOR_SELECTOR, calldata.span());
            'put_color DONE'.print();
        }

        /// Remove color on a certain position
        ///
        /// # Arguments
        ///
        /// * `position` - Position of the pixel.
        /// * `player_id` - Id of the player calling
        fn remove_color(self: @ContractState, position: Position) {
            // Load important variables
            let world = self.world_dispatcher.read();
            let core_actions = Registry::core_actions(self.world_dispatcher.read());
            let player: felt252 = get_caller_address().into();


            // Call core_actions to update the color
            core_actions.update_pixel(PixelUpdate {
                position, 
                color: Option::Some(Color { r: 0, g: 0, b: 0 }) , 
                alert: Option::None, 
                timestamp: Option::None, 
                text: Option::None, 
                app: Option::None, 
                owner: Option::None 
                } );


        }
    }
}
