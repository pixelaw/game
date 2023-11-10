use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use pixelaw::core::models::pixel::{Pixel, PixelUpdate};
use pixelaw::core::utils::{get_core_actions, Direction, Position, DefaultParameters};
use starknet::{get_caller_address, get_contract_address, get_execution_info, ContractAddress};

const APP_KEY: felt252 = 'minesweeper';
const GAME_MAX_DURATION: u64 = 20000;

#[derive(Model, Copy, Drop, Serde, SerdeLen)]
struct Game {
    #[key]
    x: u64,
    #[key]
    y: u64,
    id: u32,
    state: State,
    size: u8,
    mines_amount: u8,
    started_timestamp: u64
}  

#[starknet::interface]
trait IMinesweeperActions<TContractState> {
    
    //1. read the world state
    //2. get_core_actions to call the `update_app_name` function and add the minesweeper app to the world.
    //3. update permissions to other apps (if wanted).
    fn init(self: @TContractState);

    //1. the interact function is a must of any pixelaw app. This is what the front-end calls.
    //- If you add an optional third parameter, your can allow for additional user input.
    
    //2. Load important variables
    //- world: any system that impacts the world needs to 
    //- core_actions:
    //- position: the position clicked by the player. (part of default parameter utils)
    //- player: get_player_address
    //- system: get_system_address
    //- pixel: get the state of selected pixel.
    
    //3. check if 10x10 pixel field around the pixel is ownerless.  && has to check if the selected pixel is inside an open minesweeper.

    //4. load the game
    //- create a game struct(key x, key y, id, state, size, mines_amount, player address, started _timestamp)
    //- create minesweeper game
    
    //5. add game to world State
    //- update properties of affected pixels.
    
    //6. set the mines
    
    
    //7. checks if there is an open game 
    fn interact(self: @TContractState, default_params: DefaultParameters, size: u8, mines_amount: u8); //Question: How do we work with numerial input?

    //1. Load relevant pixels
    //- check if pixel is a mine or not.
    fn explore(self: @TContractState, default_params: DefaultParameters);




    fn fade(self: @TContractState, default_params: DefaultParameters);
}

#[dojo::contract]
mod minesweeper_actions {
    use starknet::{get_caller_address, get_contract_address, get_execution_info, ContractAddress
    };
    use super::IMinesweeperActions;
    use pixelaw::core::models::pixel::{Pixel, PixelUpdate};
    use pixelaw::core::models::permissions::{Permission};
    use pixelaw::core::actions::{
        IActionsDispatcher as ICoreActionsDispatcher,
        IActionsDispatcherTrait as ICoreActionsDispatcherTrait
    };
    use super::{APP_KEY, GAME_MAX_DURATION, Game};
    use pixelaw::core::utils::{get_core_actions, Position, DefaultParameters};
    use debug::PrintTrait;

    // #[derive(Drop, starknet::Event)]
    // struct GameCreated {
    //     game_id: u32,
    //     creator: ContractAddress
    // }

    // #[event]
    // #[derive(Drop, starknet::Event)]
    // enum Event {
    //     GameCreated: GameCreated
    // }

    #[external(v0)]
    impl MinesweeperActionsImpl of IMinesweeperActions<ContractState> {

        fn init(self: @ContractState) {
            let world = self.world_dispatcher.read();
            let core_actions = pixelaw::core::utils::get_core_actions(world);

            core_actions.update_app_name(APP_KEY);

            core_actions.update_permission('snake',
                Permission {
                    alert: false,
                    app: false,
                    color: true,
                    owner: false,
                    text: true,
                    timestamp: false,
                    action: false
                })
            core_actions.update_permission('paint',
                Permission {
                    alert: false,
                    app: false,
                    color: true,
                    owner: false,
                    text: true,
                    timestamp: false,
                    action: false
                })            
        }

        fn interact(self: @TContractState, default_params: DefaultParameters, size: u8, mines_amount: u8) {
            let world = self.world_dispatcher.read();
            let core_actions = get_core_actions(world);
            let position = default_params.position;
            let player = core_actions.get_player_address(default_params.for_player);
        }


}