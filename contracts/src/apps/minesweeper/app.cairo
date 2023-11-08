use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use pixelaw::core::models::pixel::{Pixel, PixelUpdate};
use pixelaw::core::utils::{Direction, Position, DefaultParameters};
use starknet::{get_caller_address, get_contract_address, get_execution_info, ContractAddress};


#[starknet::interface]
trait IMinesweeperActions<TContractState> {
    fn init(self: @TContractState);
    fn interact(self: @TContractState, default_params: DefaultParameters);
    fn fade(self: @TContractState, default_params: DefaultParameters);
}

const APP_KEY: felt252 = 'minesweeper';

#[dojo::contract]
mod minesweeper_actions {
    use starknet::{
        get_tx_info, get_caller_address, get_contract_address, get_execution_info, ContractAddress
    };

    use super::IMinesweeperActions;
    use pixelaw::core::models::pixel::{Pixel, PixelUpdate};
    use pixelaw::core::models::registry::Registry;
    use pixelaw::core::actions::{
        IActionsDispatcher as ICoreActionsDispatcher,
        IActionsDispatcherTrait as ICoreActionsDispatcherTrait
    };
    use super::APP_KEY;
    use pixelaw::core::utils::{Direction, Position, DefaultParameters};

    use debug::PrintTrait;

    fn subu8(nr: u8, sub: u8) -> u8 {
        if nr >= sub {
            return nr - sub;
        } else {
            return 0;
        }
    }

    // impl: implement functions specified in trait
    #[external(v0)]
    impl ActionsImpl of IMinesweeperActions<ContractState> {
        /// Initialize the Minesweeper App
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
        fn interact(self: @ContractState, default_params: DefaultParameters) {
            'put_mine'.print();

            // Load important variables
            let world = self.world_dispatcher.read();
            let core_actions = Registry::core_actions(world);
            let position = default_params.position;
            let player = Registry::get_player_address(world, default_params.for_player);
            let system = Registry::get_system_address(world, default_params.for_system);

            // Load the Pixel
            let mut pixel = get!(world, (position.x, position.y), (Pixel));

            // TODO: Load Paint App Settings like the fade steptime
            // For example for the Cooldown feature
            let COOLDOWN_SECS = 300; // every player can only have two bombs active at the same time

            // Check if 300 seconds have passed or if the sender is the owner
            assert(
                starknet::get_block_timestamp() - pixel.timestamp < COOLDOWN_SECS,
                'Cooldown not over'
            );

            assert(
                pixel.owner.is_zero() || (pixel.owner) == player && starknet::get_block_timestamp()
                    - pixel.timestamp < COOLDOWN_SECS,
                'Pixel is already owned'
            );

            // We can now update color of the pixel
            core_actions
                .update_pixel(
                    player,
                    system,
                    PixelUpdate {
                        x: position.x,
                        y: position.y,
                        color: Option::None, //changed because a minesweeper pixel will be invisible
                        alert: Option::None,
                        timestamp: Option::None,
                        text: Option::None,
                        app: Option::Some(system),
                        owner: Option::Some(player),
                        action: Option::None // Not using this feature for paint
                    }
                );

            'put_color DONE'.print();
        }


        /// Put color on a certain position
        ///
        /// # Arguments
        ///
        /// * `position` - Position of the pixel.
        /// * `new_color` - Color to set the pixel to.
        fn fade(self: @ContractState, default_params: DefaultParameters) {
            'fade'.print();

            let world = self.world_dispatcher.read();
            let core_actions = Registry::core_actions(world);
            let position = default_params.position;
            let player = Registry::get_player_address(world, default_params.for_player);
            let system = Registry::get_system_address(world, default_params.for_system);
            let pixel = get!(world, (position.x, position.y), Pixel);

            let FADE_SECONDS = 600;

            // We implement fading by scheduling a new put_fading_color
            let queue_timestamp = starknet::get_block_timestamp() + FADE_SECONDS;
            let mut calldata: Array<felt252> = ArrayTrait::new();

            let THIS_CONTRACT_ADDRESS = get_contract_address();

            // Calldata[0]: Calling player
            calldata.append(player.into());

            // Calldata[1]: Calling system
            calldata.append(THIS_CONTRACT_ADDRESS.into());

            // Calldata[2,3] : Position[x,y]
            calldata.append(position.x.into());
            calldata.append(position.y.into());

            // Calldata[4] : Color
            //calldata.append(new_color.into()); //changed: removed, no color

            core_actions
                .schedule_queue(
                    queue_timestamp, // When to fade next
                    THIS_CONTRACT_ADDRESS, // This contract address
                    get_execution_info().unbox().entry_point_selector, // This selector
                    calldata.span() // The calldata prepared
                );
            'put_fading_color DONE'.print();
        }
    }
}
