use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use pixelaw::core::models::pixel::{Pixel, PixelUpdate};
use starknet::{get_caller_address, get_contract_address, get_execution_info, ContractAddress};


#[starknet::interface]
trait IActions<TContractState> {
    fn init(self: @TContractState);
    fn interact(self: @TContractState, x:u64, y:u64, color: u32);
    fn put_color(
        self: @TContractState, for_player: ContractAddress, for_system: ContractAddress,x:u64, y:u64, color: u32
    );
    fn put_fading_color(
        self: @TContractState, for_player: ContractAddress, for_system: ContractAddress,x:u64, y:u64, color: u32
    );
    fn remove_color(self: @TContractState, for_player: ContractAddress, for_system: ContractAddress,x:u64, y:u64);
}

const APP_KEY: felt252 = 'paint';

#[dojo::contract]
mod paint_actions {
    use starknet::{get_tx_info,get_caller_address, get_contract_address, get_execution_info, ContractAddress};

    use super::IActions;
    use pixelaw::core::models::pixel::{Pixel, PixelUpdate};
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


// ARGB
// 0xFF FF FF FF
// empty: 0x 00 00 00 00
// normal color: 0x 00 FF FF FF

fn encode_color(r: u8, g: u8, b: u8) -> u32 {
    (r.into() * 0x10000) + (g.into() * 0x100) + b.into()
}

fn decode_color(color: u32) -> (u8, u8, u8) {
        let r = (color / 0x10000);
        let g = (color / 0x100) & 0xff;
        let b = color & 0xff;


    (r.try_into().unwrap(), g.try_into().unwrap(), b.try_into().unwrap())
}

    // impl: implement functions specified in trait
    #[external(v0)]
    impl ActionsImpl of IActions<ContractState> {
        /// Initialize the Paint App (TODO I think, do we need this??)
        fn init(self: @ContractState) {
            let core_actions = Registry::core_actions(self.world_dispatcher.read());

            core_actions.update_app_name(APP_KEY);
        }


        fn interact(
            self: @ContractState,
            x: u64,
            y: u64,
            color: u32
        ) {
            // assert pixel is empty OR pixel is ( owned AND has app permissions)
            let player = get_tx_info().unbox().account_contract_address;

            // if existing color is same as given, start fading

            // normal:
            // put_color
            self.put_color(
              player,
              get_contract_address(),
              x,
              y,
              color
            );


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
            x: u64,
            y: u64,
            color: u32
        ) {
            'put_color'.print();
color.print();
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
            let mut pixel = get!(world, (x,y), (Pixel));

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
                        x,y,
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
            x: u64,
            y: u64,
            color: u32
        ) {
            'put_fading_color'.print();


            // for_player needs to be zero if it came in like that
            self.put_color(for_player, for_system, x,y, color);

            // Load important variables
            let world = self.world_dispatcher.read();
            let core_actions = Registry::core_actions(self.world_dispatcher.read());
            let player = Registry::get_player_address(world, for_player);
            let system = Registry::get_system_address(world, for_system);



            let (r,g,b) = decode_color(color);

            // If the color is 0,0,0 , let's stop the process, fading is done.
            if r == 0 && g == 0 && b == 0 {
                'fading is done'.print();
                return;
            }



            // Fade the color
            let FADE_STEP = 5;
            let new_color = encode_color (
                subu8(r, FADE_STEP),
                subu8(g, FADE_STEP),
                subu8(b, FADE_STEP)
            );

            let FADE_SECONDS = 0;


            // We implement fading by scheduling a new put_fading_color
            let queue_timestamp = starknet::get_block_timestamp() + FADE_SECONDS;
            let mut calldata: Array<felt252> = ArrayTrait::new();


            let THIS_CONTRACT_ADDRESS = get_contract_address();

            // Calldata[0]: Calling player
            calldata.append(player.into());

            // Calldata[1]: Calling system
            calldata.append(THIS_CONTRACT_ADDRESS.into());

            // Calldata[2,3] : Position[x,y]
            calldata.append(x.into());
            calldata.append(y.into());

            // Calldata[4] : Color
            calldata.append(new_color.into());

            core_actions
                .schedule_queue(
                    queue_timestamp, // When to fade next
                    THIS_CONTRACT_ADDRESS, // This contract address
                    get_execution_info().unbox().entry_point_selector, // This selector
                    calldata.span() // The calldata prepared
                );
            'put_fading_color DONE'.print();
        }


        fn remove_color(
            self: @ContractState,
            for_player: ContractAddress,
            for_system: ContractAddress,
            x: u64,
            y: u64
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
                        x,y,
                        color: Option::Some(0),
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
