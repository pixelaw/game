use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use pixelaw::core::models::pixel::{Pixel, PixelUpdate, Color, Position};
use starknet::{get_caller_address, get_contract_address, get_execution_info, ContractAddress};


#[starknet::interface]
trait IActions<TContractState> {
    fn init(self: @TContractState);
    fn put_color(
        self: @TContractState, for_player: ContractAddress, for_system: ContractAddress,position: Position, color: Color
    );
    fn put_fading_color(
        self: @TContractState, for_player: ContractAddress, for_system: ContractAddress, position: Position, color: Color
    );
    fn remove_color(self: @TContractState, for_player: ContractAddress, for_system: ContractAddress, position: Position);
}

const APP_KEY: felt252 = 'paint';

#[dojo::contract]
mod paint_actions {
    use starknet::{get_caller_address, get_contract_address, get_execution_info, ContractAddress};

    use super::IActions;
    use pixelaw::core::models::pixel::{Pixel, PixelUpdate, Color, Position};
    use pixelaw::core::models::registry::Registry;
    use pixelaw::core::actions::{
        IActionsDispatcher as ICoreActionsDispatcher,
        IActionsDispatcherTrait as ICoreActionsDispatcherTrait
    };
    use super::APP_KEY;

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
        fn put_color(
            self: @ContractState, 
            for_player: ContractAddress, 
            for_system: ContractAddress, 
            position: Position, 
            color: Color
        ) {
            'put_color'.print();

            // Load important variables
            let world = self.world_dispatcher.read();
            let core_actions = Registry::core_actions(self.world_dispatcher.read());

            let player = Registry::get_player_address(world, for_player);

            // Retrieve the current system. There are 2 main scenarios here:
            // 1) This system was called by a player, and we use the current contract address
            // 2) This system was called by CoreActions.process_queue, and we need to use the for_system argument
            //
            // As long as App developers implement this, permission checks should work normally.
            // !!! App developers can cheat (send a different system with more permissions) here
            // Is this an issue? They override the caller, so theoretically their own permissions.
            // Right now I cannot think of any adversarial activity, just devs shooting themselves in the foot 
            let for_system = Registry::get_system_address(world, for_system);

            // Load the Pixel
            let mut pixel = get!(world, (position).into(), (Pixel));

            // TODO: Load Paint App Settings like the fade steptime
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
            core_actions
                .update_pixel(
                    player,
                    for_system,
                    PixelUpdate {
                        position,
                        color: Option::Some(color),
                        alert: Option::None,
                        timestamp: Option::None,
                        text: Option::None,
                        app: Option::None,
                        owner: Option::None
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
        fn put_fading_color(
            self: @ContractState,
            for_player: ContractAddress,
            for_system: ContractAddress,
            position: Position,
            color: Color
        ) {
            'put_fading_color'.print();

            self.put_color(for_player, for_system, position, color);

            // If the color is 0,0,0 , let's stop the process, fading is done.
            if color.r == 0 && color.g == 0 && color.b == 0 {
                return;
            }

            // Load important variables
            let world = self.world_dispatcher.read();
            let core_actions = Registry::core_actions(self.world_dispatcher.read());
            let player = Registry::get_player_address(world, for_player);
            let system = Registry::get_system_address(world, for_system);

            // Fade the color
            let FADE_STEP = 5;
            let new_color = Color {
                r: subu8(color.r, FADE_STEP),
                g: subu8(color.g, FADE_STEP),
                b: subu8(color.b, FADE_STEP)
            };

            let FADE_SECONDS = 5;

            // TODO this is probably expensive and may not even work.. check!
            // let selector = starknet_keccak('put_fading_color');
            // let selector = get_execution_info().unbox().entry_point_selector;

            // We implement fading by scheduling a new put_fading_color
            let fade_time = starknet::get_block_timestamp() + FADE_SECONDS;
            let mut calldata: Array<felt252> = ArrayTrait::new();


            let THIS_CONTRACT_ADDRESS = get_contract_address();

            // Calldata[0]: Calling player
            calldata.append(player.into());

            // Calldata[1]: Calling system
            calldata.append(THIS_CONTRACT_ADDRESS.into());

            // Calldata[2,3] : Position[x,y]
            position.serialize(ref calldata);

            core_actions
                .schedule_queue(
                    fade_time, // When to fade next
                    THIS_CONTRACT_ADDRESS, // This contract address
                    get_execution_info().unbox().entry_point_selector, // This selector
                    calldata // The calldata prepared
                );
            'put_fading_color DONE'.print();
        }

        /// Remove color on a certain position
        ///
        /// # Arguments
        ///
        /// * `position` - Position of the pixel.
        /// * `player_id` - Id of the player calling
        fn remove_color(
            self: @ContractState, 
            for_player: ContractAddress, 
            for_system: ContractAddress,
            position: Position
            ) {
            // Load important variables
            let world = self.world_dispatcher.read();
            let core_actions = Registry::core_actions(self.world_dispatcher.read());

            let player = Registry::get_player_address(world, for_player);
            let system = Registry::get_system_address(world, for_system);

            // Call core_actions to update the color
            core_actions
                .update_pixel(
                    player,
                    system,
                    PixelUpdate {
                        position,
                        color: Option::Some(Color { r: 0, g: 0, b: 0 }),
                        alert: Option::None,
                        timestamp: Option::None,
                        text: Option::None,
                        app: Option::None,
                        owner: Option::None
                    }
                );
        }
    }
}
