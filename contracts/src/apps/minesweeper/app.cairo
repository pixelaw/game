use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use pixelaw::core::models::pixel::{Pixel, PixelUpdate};
use pixelaw::core::utils::{get_core_actions, Direction, Position, DefaultParameters};
use pixelaw::core::models::registry::{App, AppName, CoreActionsAddress};
use starknet::{get_caller_address, get_contract_address, get_execution_info, ContractAddress};

const APP_KEY: felt252 = 'minesweeper';
const GAME_MAX_DURATION: u64 = 20000;

#[derive(Serde, Copy, Drop, PartialEq, Introspect)]
enum State {
    None: (),
    Open: (),
    Finished: ()
}

#[derive(Model, Copy, Drop, Serde, SerdeLen)]
struct Game {
    #[key]
    x: u64,
    #[key]
    y: u64,
    id: u32,
    creator: ContractAddress,
    state: State,
    size: u64,
    mines_amount: u64,
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
    
    
    fn interact(self: @TContractState, default_params: DefaultParameters, size: u64, mines_amount: u64); //Question: How do we work with numerial input?

    //1. Load relevant pixels
    //- check if pixel is a mine or not.
    fn explore(self: @TContractState, default_params: DefaultParameters);




    fn fade(self: @TContractState, default_params: DefaultParameters, size: u64);
	fn ownerless_space(self: @TContractState, default_params: DefaultParameters, size: u64) -> u64;
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
    use super::{APP_KEY, GAME_MAX_DURATION, Game, State};
    use pixelaw::core::utils::{get_core_actions, Position, DefaultParameters};
	use pixelaw::core::models::registry::{App, AppName, CoreActionsAddress};
    use debug::PrintTrait;

    #[derive(Drop, starknet::Event)]
    struct GameOpened {
        game_id: u32,
        creator: ContractAddress
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        GameOpened: GameOpened
    }

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
                });
            core_actions.update_permission('paint',
                Permission {
                    alert: false,
                    app: false,
                    color: true,
                    owner: false,
                    text: true,
                    timestamp: false,
                    action: false
                });       
        }

        fn interact(self: @ContractState, default_params: DefaultParameters, size: u64, mines_amount: u64) {
            let world = self.world_dispatcher.read();
            let core_actions = get_core_actions(world);
            let position = default_params.position;
            let player = core_actions.get_player_address(default_params.for_player);
            let system = core_actions.get_system_address(default_params.for_system);
            let mut pixel = get!(world, (position.x, position.y), (Pixel));
			let caller_address = get_caller_address();
            let caller_app = get!(world, caller_address, (App));
			let mut game = get!(world, (position.x, position.y), Game);

			if pixel.app == caller_app.system && game.state == State::Open
			{
				self.explore(DefaultParameters {
					for_player: player,
					for_system: system,
					position: position,
					color: default_params.color, //is there an issue here?
				});
			} 
			else if self.ownerless_space == true //check if size grid ownerless;
			{
				let mut id = world.uuid(); //do we need this in this condition?
                game = 
                    Game {
                        x: position.x,
                        y: position.y,
                        id,
                        creator: player,
                        state: State::Open,
                        size: size,
                        mines_amount: mines_amount,
                        started_timestamp: starknet::get_block_timestamp()
                    };

                emit!(world, GameOpened {game_id: game.id, creator: player});

                set!(world, (game));

                let mut i: u64 = 0;
				let mut j: u64 = 0;
                loop { 
					if i > size {
						break;
					}
					j = 0;
					loop { 
						if j > size {
							break;
						}
						core_actions
							.update_pixel(
							player,
							system,
							PixelUpdate {
								x: position.x + j,
								y: position.y + i,
								color: Option::Some(default_params.color), //should I pass in a color to define the minesweepers field color?
								alert: Option::None,
								timestamp: Option::None,
								text: Option::None,
								app: Option::Some(get_contract_address().into()),
								owner: Option::Some(player.into()),
								action: Option::Some('reveal'), //Question: Is this the correct way to use it?
								}
							);
							j += 1;
					}
					i += 1;
				}
				i = 0;
				loop {
					if i > mines_amount {
						break;
					}
					core_actions
					.update_pixel(
						player,
						system,
						PixelUpdate {
							x: position.x + j, //missing a random element
							y: position.y + i, //missing a random element
							color: Option::Some(default_params.color),
							alert: Option::None,
							timestamp: Option::None,
							text: Option::None,
							app: Option::Some(get_contract_address().into()),
							owner: Option::Some(player.into()),
							action: Option::Some('explode'), //Question: See above.
						}
					);
					i += 1;
				}
			} else {
				'find a free area'.print();
			}
			self.fade(DefaultParameters {
					for_player: player,
					for_system: system,
					position: position,
					color: default_params.color,
			}, size: size);
		}

		fn explore(self: @ContractState, default_params: DefaultParameters) {
			let world = self.world_dispatcher.read();
            let core_actions = get_core_actions(world);
            let position = default_params.position;
            let player = core_actions.get_player_address(default_params.for_player);
            let system = core_actions.get_system_address(default_params.for_system);
            let mut pixel = get!(world, (position.x, position.y), (Pixel));

			if pixel.action == 'reveal' {
				core_actions
					.update_pixel(
						player,
						system,
						PixelUpdate {
							x: position.x,
							y: position.y,
							color: Option::Some(default_params.color), //whats the default color here?
							alert: Option::None,
							timestamp: Option::None,
							text: Option::None,
							app: Option::None,
							owner: Option::None,
							action: Option::None,
						}
					);
			} else if pixel.action == 'explode' {
				core_actions
					.update_pixel(
						player,
						system,
						PixelUpdate {
							x: position.x,
							y: position.y,
							color: Option::Some(default_params.color),
							alert: Option::None,
							timestamp: Option::None,
							text: Option::Some('U+1F4A3'),
							app: Option::None,
							owner: Option::None,
							action: Option::None,
						}
					);
			}
        }

		fn fade(self: @ContractState, default_params: DefaultParameters, size: u64) {
			let world = self.world_dispatcher.read();
            let core_actions = get_core_actions(world);
            let position = default_params.position;
            let player = core_actions.get_player_address(default_params.for_player);
            let system = core_actions.get_system_address(default_params.for_system);
            let mut pixel = get!(world, (position.x, position.y), (Pixel));

			//schedule queue to end game
			let queue_timestamp = starknet::get_block_timestamp() + GAME_MAX_DURATION;
			let mut calldata: Array<felt252> = ArrayTrait::new();

            let THIS_CONTRACT_ADDRESS = get_contract_address();

            // Calldata[0]: Calling player
            calldata.append(player.into());

            // Calldata[1]: Calling system
            calldata.append(THIS_CONTRACT_ADDRESS.into());

			let mut i: u64 = 0;
			let mut j: u64 = 0;
			loop { 
				if i > size {
					break;
					}
					j = 0;
					loop { 
						if j > size {
							break;
						}
						// Calldata[2,3] : Position[x,y]
						calldata.append((position.x + j).into());
						calldata.append((position.y + i).into());

						// Calldata[4] : Color
						calldata.append(default_params.color.into());

						core_actions
							.schedule_queue(
								queue_timestamp,
								THIS_CONTRACT_ADDRESS,
								get_execution_info().unbox().entry_point_selector, // This selector
								calldata.span() // The calldata prepared
							);
						j += 1;
					}
					i += 1;
				}
			'Game ending initiated'.print(); //Clarify how to work with the queue.
		}

		fn ownerless_space(self: @ContractState, default_params: DefaultParameters, size: u64) -> u64 {
			let world = self.world_dispatcher.read();
            let core_actions = get_core_actions(world);
            let position = default_params.position;
            let player = core_actions.get_player_address(default_params.for_player);
            let system = core_actions.get_system_address(default_params.for_system);
            let mut pixel = get!(world, (position.x, position.y), (Pixel));

			let mut i: u64 = 0;
			let mut j: u64 = 0;

			loop {
				if !(pixel.owner.is_zero() && i <= size)
				{
					break;
				}
				pixel = get!(world, (position.x, (position.y + i)), (Pixel));
				j = 0;
				loop {
					if !(pixel.owner.is_zero() && j <= size)
					{
						break;
					}
					pixel = get!(world, ((position.x + j), position.y), (Pixel));
					j += 1;
				}
				i += 1;
			}
			if i > size && j > size { //how the hell do I return the right stuff??
				size + 1
			}
			size + 1
		}
	}
}
