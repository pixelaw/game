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
    fn init(self: @TContractState);
    fn interact(self: @TContractState, default_params: DefaultParameters, size: u64, mines_amount: u64);
	fn reveal(self: @TContractState, default_params: DefaultParameters);
	fn explode(self: @TContractState, default_params: DefaultParameters);
    //fn fade(self: @TContractState, default_params: DefaultParameters, size: u64);
	fn ownerless_space(self: @TContractState, default_params: DefaultParameters, size: u64) -> bool;
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
	use poseidon::poseidon_hash_span;

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
			let timestamp = starknet::get_block_timestamp();

			//if pixel.app == caller_app.system && game.state == State::Open && pixel.alert == 'reveal'
			if pixel.alert == 'reveal'
			{
				self.reveal(default_params);
			}
			//else if pixel.app == caller_app.system && game.state == State::Open && pixel.alert == 'explode'
			else if pixel.alert == 'explode'
			{
				self.explode(default_params);
			}
			else if self.ownerless_space(default_params, size: size) == true //check if size grid ownerless;
			{
				let mut id = world.uuid();
                game = 
                    Game {
                        x: position.x,
                        y: position.y,
                        id,
                        creator: player,
                        state: State::Open,
                        size: size,
                        mines_amount: mines_amount,
                        started_timestamp: timestamp
                    };

                emit!(world, GameOpened {game_id: game.id, creator: player});

                set!(world, (game));

                let mut i: u64 = 0;
				let mut j: u64 = 0;
                loop { 
					if i >= size {
						break;
					}
					j = 0;
					loop { 
						if j >= size {
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
								alert: Option::Some('reveal'),
								timestamp: Option::None,
								text: Option::None,
								app: Option::Some(system),
								owner: Option::Some(player),
								action: Option::None,
								}
							);
							j += 1;
					};
					i += 1;
				};

				let mut random_number: u256 = 0;

				i = 0;
				loop {
					if i >= mines_amount {
						break;
					}
					let timestamp_felt252 = timestamp.into();
					let x_felt252 = position.x.into();
					let y_felt252 = position.y.into();
					let i_felt252 = i.into();

					//random = (timestamp + i) + position.x.into() + position.y.into();

					let hash: u256 = poseidon_hash_span(array![timestamp_felt252, x_felt252, y_felt252, i_felt252].span()).into();
					random_number = hash % (size * size).into();
					
					
					//get a random value
					//random = (timestamp + i) ^ (position.x.into() + position.y.into());

					//generate random x and y within the grid.
					//let mut random_x = random % size;
					//let mut random_y = (random / size) % size;

					//check if mine already on this pixel
					//if get!(world, ((position.x + random_x), (position.y + random_y)), Pixel).alert != 'explode'
					//{
						core_actions
							.update_pixel(
								player,
								system,
								PixelUpdate {
									//x: (position.x + random_x),
									x: position.x + (random_number / size.into()).try_into().unwrap(),
									//y: (position.y + random_y),
									y: position.y + (random_number % size.into()).try_into().unwrap(),
									color: Option::Some(default_params.color),
									alert: Option::Some('explode'),
									timestamp: Option::None,
									text: Option::None,
									app: Option::Some(system),
									owner: Option::Some(player),
									action: Option::None,
								}
							);
						i += 1;
					//}
					j += 1;
				};
			} else {
				'find a free area'.print();
			}
			// self.fade(DefaultParameters {
			// 		for_player: player,
			// 		for_system: system,
			// 		position: position,
			// 		color: default_params.color,
			// }, size: size);
		}

		fn reveal(self: @ContractState, default_params: DefaultParameters) {
			let world = self.world_dispatcher.read();
            let core_actions = get_core_actions(world);
            let position = default_params.position;
            let player = core_actions.get_player_address(default_params.for_player);
            let system = core_actions.get_system_address(default_params.for_system);
            let mut pixel = get!(world, (position.x, position.y), (Pixel));

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
						text: Option::Some('U+1F30E'),
						app: Option::None,
						owner: Option::None,
						action: Option::None,
					}
				);
        }

		fn explode(self: @ContractState, default_params: DefaultParameters) {
			let world = self.world_dispatcher.read();
            let core_actions = get_core_actions(world);
            let position = default_params.position;
            let player = core_actions.get_player_address(default_params.for_player);
            let system = core_actions.get_system_address(default_params.for_system);
            let mut pixel = get!(world, (position.x, position.y), (Pixel));

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

		fn ownerless_space(self: @ContractState, default_params: DefaultParameters, size: u64) -> bool {
			let world = self.world_dispatcher.read();
            let core_actions = get_core_actions(world);
            let position = default_params.position;
            let mut pixel = get!(world, (position.x, position.y), (Pixel));

			let mut i: u64 = 0;
			let mut j: u64 = 0;
			let mut check_test: bool = true;

			let check = loop {
				if !(pixel.owner.is_zero() && i <= size)
				{
					break false;
				}
				pixel = get!(world, (position.x, (position.y + i)), (Pixel));
				j = 0;
				loop {
					if !(pixel.owner.is_zero() && j <= size)
					{
						break false;
					}
					pixel = get!(world, ((position.x + j), position.y), (Pixel));
					j += 1;
				};
				i += 1;
				break true;
			};
			check
		}

		// this might have to wait due to overloading server.
		// fn fade(self: @ContractState, default_params: DefaultParameters, size: u64) {
		// 	let world = self.world_dispatcher.read();
        //     let core_actions = get_core_actions(world);
        //     let position = default_params.position;
        //     let player = core_actions.get_player_address(default_params.for_player);
        //     let system = core_actions.get_system_address(default_params.for_system);
        //     let mut pixel = get!(world, (position.x, position.y), (Pixel));

		// 	//schedule queue to end game
		// 	let queue_timestamp = starknet::get_block_timestamp() + GAME_MAX_DURATION;
		// 	let mut calldata: Array<felt252> = ArrayTrait::new();

        //     let THIS_CONTRACT_ADDRESS = get_contract_address();

        //     // Calldata[0]: Calling player
        //     calldata.append(player.into());

        //     // Calldata[1]: Calling system
        //     calldata.append(THIS_CONTRACT_ADDRESS.into());

		// 	let mut i: u64 = 0;
		// 	let mut j: u64 = 0;
		// 	loop { 
		// 		if i > size {
		// 			break;
		// 			}
		// 			j = 0;
		// 			loop { 
		// 				if j > size {
		// 					break;
		// 				}
		// 				// Calldata[2,3] : Position[x,y]
		// 				calldata.append((position.x + j).into());
		// 				calldata.append((position.y + i).into());

		// 				// Calldata[4] : Color
		// 				calldata.append(default_params.color.into());

		// 				core_actions
		// 					.schedule_queue(
		// 						queue_timestamp,
		// 						THIS_CONTRACT_ADDRESS,
		// 						get_execution_info().unbox().entry_point_selector, // This selector
		// 						calldata.span() // The calldata prepared
		// 					);
		// 				j += 1;
		// 			};
		// 			i += 1;
		// 		};
		// 	'Game ending initiated'.print(); //Clarify how to work with the queue.
		// }
	}
}