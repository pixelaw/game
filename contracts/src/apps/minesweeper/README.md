# Minesweeper Tutorial

### Building a game in PixeLAW is easy.

Fundamentals

You **do not** need:
1. Front-End Development: The PixeLAW front-end will automatically pick up your game contract and allow players to interact with it.

1. Server Management: Use the blockchain for your contracts, we handle the rest.

You **need**:

1. **[Cairo](https://book.cairo-lang.org/)** - to build your game app contracts. Each game is one contract.
2. **[Dojo](https://book.dojoengine.org/)** - to access the PixeLAW world contract. Dojo provides
    1. Katana: Sequencer to deploy and create your transactions.
    2. Torii: Automatic Indexer to allow the PixeLAW front-end to render the world state.

### What we will build

We will build a game of Minesweeper.

1. Generate a field of pixels inside PixeLAW of a specified size `size` and a randomly distributed number of mines `mines_amount`.
2. Allow players to click any pixel inside the created minesweeper field and reveal whether they clicked on a mine or not.

Sounds simple enough. Lets start!

## Building Minesweeper in PixeLAW

### Import dependencies

The following imports contracts that you will require to develop your own.

```rust
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use pixelaw::core::models::pixel::{Pixel, PixelUpdate};
use pixelaw::core::utils::{get_core_actions, Direction, Position, DefaultParameters};
use pixelaw::core::models::registry::{App, AppName, CoreActionsAddress};
use starknet::{get_caller_address, get_contract_address, get_execution_info, ContractAddress};
```

### Set global objects

```rust
//Enum that tracks the state of each Game.
#[derive(Serde, Copy, Drop, PartialEq, Introspect)]
enum State {
    None: (),
    Open: (),
    Finished: ()
}

//This is the game object for each createdminesweeper game inside PixeLAW.
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
```

### Define the App Key

Every single PixeLAW game has an APP_KEY in order to add the game to the registry and initialise the on the front-end.

```rust
const APP_KEY: felt252 = 'minesweeper';
```

### Create your contract interface

```rust
#[starknet::interface]
trait IMinesweeperActions<TContractState> {
    fn init(self: @TContractState);
    fn interact(self: @TContractState, default_params: DefaultParameters, size: u64, mines_amount: u64);
		fn reveal(self: @TContractState, default_params: DefaultParameters);
		fn explode(self: @TContractState, default_params: DefaultParameters);
		fn ownerless_space(self: @TContractState, default_params: DefaultParameters, size: u64) -> bool;
}
```

1. **Initiate your game**

```rust
fn init(self: @TContractState);
```

Calls the PixeLAW core action `update_app_name(APP_KEY);` to add the minesweeper game to the world registry. Set permissions to what extent other game apps can impact the minesweeper game state.

1. **Interact with the world**

```rust
fn interact(self: @TContractState, default_params: DefaultParameters, size: u64, mines_amount: u64);
```

Every PixeLAW app **must** have an `interact` function which is called by the front-end whenever a player wants to interact with your game.

1. **Game Design Functionality**

```rust
fn reveal(self: @TContractState, default_params: DefaultParameters);
fn explode(self: @TContractState, default_params: DefaultParameters);
```

These functions are called by the `interact` function and define what happens whenever a player selects a pixel in the minesweeper field that is either mine → `explode` or not → `reveal`.

1. **Conditionals**

```rust
fn ownerless_space(self: @TContractState, default_params: DefaultParameters, size: u64) -> bool;
```

In this case, we decided to create a separate function that checks for certain conditions before a game can be started. Again, this function is only called through the `interact` function.

### Create your contract

```rust
#[dojo::contract]
mod minesweeper_actions {

// 1. Contract Imports.
// 2. Events.
// 3. Define external functions.

}
```

1. **Contract Imports**

```rust
#[dojo::contract]
mod minesweeper_actions {

// 1. Contract Imports.
		use starknet::{get_caller_address, get_contract_address, get_execution_info, ContractAddress};
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

// 2. Events.
// 3. Define external functions.
}
```

1. **Events**

```rust
#[dojo::contract]
mod minesweeper_actions {

// 1. Contract Imports.

// 2. Events.
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

// 3. Define external functions.
}
```

1. **Define external functions**

```rust
#[dojo::contract]
mod minesweeper_actions {

// 1. Contract Imports.
// 2. Events.

// 3. Define external functions.
#[external(v0)]
    impl MinesweeperActionsImpl of IMinesweeperActions<ContractState> {
        fn init(self: @ContractState);
				fn interact(self: @TContractState, default_params: DefaultParameters, size: u64, mines_amount: u64);
				fn reveal(self: @TContractState, default_params: DefaultParameters);
				fn explode(self: @TContractState, default_params: DefaultParameters);
				fn ownerless_space(self: @TContractState, default_params: DefaultParameters, size: u64) -> bool;
		}
}
```

3.1 `fn init(self: @ContractState);`

```rust
#[dojo::contract]
mod minesweeper_actions {

// 1. Contract Imports.
// 2. Events.

// 3. Define external functions.
#[external(v0)]
    impl MinesweeperActionsImpl of IMinesweeperActions<ContractState> {
        fn init(self: @ContractState){
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
				fn interact(self: @TContractState, default_params: DefaultParameters, size: u64, mines_amount: u64);
				fn reveal(self: @TContractState, default_params: DefaultParameters);
				fn explode(self: @TContractState, default_params: DefaultParameters);
				fn ownerless_space(self: @TContractState, default_params: DefaultParameters, size: u64) -> bool;
		}
}
```

3.2 `fn interact(self: @TContractState, default_params: DefaultParameters, size: u64, mines_amount: u64);`

```rust
#[dojo::contract]
mod minesweeper_actions {

// 1. Contract Imports.
// 2. Events.

// 3. Define external functions.
#[external(v0)]
    impl MinesweeperActionsImpl of IMinesweeperActions<ContractState> {
        fn init(self: @ContractState);
				fn interact(self: @TContractState, default_params: DefaultParameters, size: u64, mines_amount: u64){
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

			if pixel.alert == 'reveal'
			{
				self.reveal(default_params);
			}
			else if pixel.alert == 'explode'
			{
				self.explode(default_params);
			}
			else if self.ownerless_space(default_params, size: size) == true //check if size grid ownerless;
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
								color: Option::Some(default_params.color),
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

					let hash: u256 = poseidon_hash_span(array![timestamp_felt252, x_felt252, y_felt252, i_felt252].span()).into();
					random_number = hash % (size * size).into();
						core_actions
							.update_pixel(
								player,
								system,
								PixelUpdate {
									x: position.x + (random_number / size.into()).try_into().unwrap(),
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
		}
				fn reveal(self: @TContractState, default_params: DefaultParameters);
				fn explode(self: @TContractState, default_params: DefaultParameters);
				fn ownerless_space(self: @TContractState, default_params: DefaultParameters, size: u64) -> bool;
		}
}
```

3.3 `fn reveal(self: @TContractState, default_params: DefaultParameters);`

```rust
#[dojo::contract]
mod minesweeper_actions {

// 1. Contract Imports.
// 2. Events.

// 3. Define external functions.
#[external(v0)]
    impl MinesweeperActionsImpl of IMinesweeperActions<ContractState> {
        fn init(self: @ContractState);
				fn interact(self: @TContractState, default_params: DefaultParameters, size: u64, mines_amount: u64);
				fn reveal(self: @TContractState, default_params: DefaultParameters){
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
				fn explode(self: @TContractState, default_params: DefaultParameters);
				fn ownerless_space(self: @TContractState, default_params: DefaultParameters, size: u64) -> bool;
		}
}
```

3.4 `fn explode(self: @TContractState, default_params: DefaultParameters);`

```rust
#[dojo::contract]
mod minesweeper_actions {

// 1. Contract Imports.
// 2. Events.

// 3. Define external functions.
#[external(v0)]
    impl MinesweeperActionsImpl of IMinesweeperActions<ContractState> {
        fn init(self: @ContractState);
				fn interact(self: @TContractState, default_params: DefaultParameters, size: u64, mines_amount: u64);
				fn reveal(self: @TContractState, default_params: DefaultParameters);
				fn explode(self: @TContractState, default_params: DefaultParameters) {
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
				fn ownerless_space(self: @TContractState, default_params: DefaultParameters, size: u64) -> bool;
		}
}
```

3.5 `fn ownerless_space(self: @TContractState, default_params: DefaultParameters, size: u64) -> bool;`

```rust
#[dojo::contract]
mod minesweeper_actions {

// 1. Contract Imports.
// 2. Events.

// 3. Define external functions.
#[external(v0)]
    impl MinesweeperActionsImpl of IMinesweeperActions<ContractState> {
        fn init(self: @ContractState);
				fn interact(self: @TContractState, default_params: DefaultParameters, size: u64, mines_amount: u64);
				fn reveal(self: @TContractState, default_params: DefaultParameters);
				fn explode(self: @TContractState, default_params: DefaultParameters);
				fn ownerless_space(self: @TContractState, default_params: DefaultParameters, size: u64) -> bool {
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
		}
}
```