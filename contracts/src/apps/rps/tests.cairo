// use starknet::{ContractAddressIntoFelt252, contract_address_const};

// use starknet::{ContractAddress, syscalls::deploy_syscall};
// use starknet::class_hash::{ClassHash, Felt252TryIntoClassHash};
// use dojo::database::query::{IntoPartitioned, IntoPartitionedQuery};
// use dojo::interfaces::{
//     IComponentLibraryDispatcher, IComponentDispatcherTrait, ISystemLibraryDispatcher,
//     ISystemDispatcherTrait
// };
// use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

// use dojo::test_utils::spawn_test_world;

// use pixelaw::components::position::Position;
// use pixelaw::rps::components::game::{game, Game};
// use pixelaw::rps::systems::create::create;
// use pixelaw::rps::systems::commit::commit;

// use pixelaw::rps::utils::hash_commit;

// use pixelaw::rps::tests::create::create_game;

// fn player_commit(world: IWorldDispatcher, game_id: u32, hash: felt252, position: Position) {
//     let mut player_commit_calldata = array::ArrayTrait::<felt252>::new();
//     player_commit_calldata.append(game_id.into());
//     player_commit_calldata.append(hash);

//     // serialize position
//     position.serialize(ref player_commit_calldata);

//     world.execute('commit'.into(), player_commit_calldata.span());
// }

// fn player_reveal(
//     world: IWorldDispatcher,
//     game_id: u32,
//     hash: felt252,
//     commit: u8,
//     salt: felt252,
//     position: Position
// ) {
//     let mut player_commit_calldata = array::ArrayTrait::<felt252>::new();
//     player_commit_calldata.append(game_id.into());
//     player_commit_calldata.append(hash);
//     player_commit_calldata.append(commit.into());
//     player_commit_calldata.append(salt);

//     // serialize position
//     position.serialize(ref player_commit_calldata);

//     world.execute('reveal'.into(), player_commit_calldata.span());
// }

#[cfg(test)]
mod tests {
    use starknet::class_hash::Felt252TryIntoClassHash;

    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use pixelaw::core::models::registry::{
        Registry, app_by_system, app_by_name, core_actions_address
    };

    use pixelaw::core::models::pixel::{Pixel, PixelUpdate};
    use pixelaw::core::models::pixel::{pixel};
    use pixelaw::core::models::permissions::{permissions};
    use pixelaw::core::utils::{Direction, Position};
    use pixelaw::core::actions::{actions, IActionsDispatcher, IActionsDispatcherTrait};

    use dojo::test_utils::{spawn_test_world, deploy_contract};

    use pixelaw::apps::rps::app::{rps_actions, game, player, IRpsActionsDispatcher, IRpsActionsDispatcherTrait};
    use pixelaw::apps::rps::app::{Game, Player};
    use pixelaw::apps::rps::app::{
        STATE_CREATED, STATE_JOINED, STATE_FINISHED, ROCK, PAPER, SCISSORS
    };


    use zeroable::Zeroable;

    fn deploy_world() -> (IWorldDispatcher, IActionsDispatcher, IRpsActionsDispatcher) {
        // Deploy World and models
        let world = spawn_test_world(
            array![
                pixel::TEST_CLASS_HASH,
                game::TEST_CLASS_HASH,
                player::TEST_CLASS_HASH,
                app_by_system::TEST_CLASS_HASH,
                app_by_name::TEST_CLASS_HASH,
                core_actions_address::TEST_CLASS_HASH,
                permissions::TEST_CLASS_HASH,
            ]
        );

        // Deploy Core actions
        let core_actions = IActionsDispatcher {
            contract_address: world
                .deploy_contract('salt', actions::TEST_CLASS_HASH.try_into().unwrap())
        };

        // Deploy RPS actions
        let rps_actions = IRpsActionsDispatcher {
            contract_address: world
                .deploy_contract('salt', rps_actions::TEST_CLASS_HASH.try_into().unwrap())
        };
        (world, core_actions, rps_actions)
    }

    #[test]
    #[available_gas(30000000)]
    fn test_playthrough() {
        // Deploy everything
        let (world, core_actions, rps_actions) = deploy_world();

        core_actions.init();
        rps_actions.init();

        // Impersonate player1
        let player1 = starknet::contract_address_const::<0x1337>();
        starknet::testing::set_contract_address(player1);

        // Set the players commitments
        let player_1_commit: u8 = SCISSORS;
        let player_2_commit: u8 = PAPER;

        // Set the player's secret salt. For the test its just different, client will send truly random
        let player_1_hash: felt252 = hash_commit(player_1_commit, '1'.into());

        rps_actions
            .interact(
                DefaultParameters {
                    for_player: Zeroable::zero(),
                    for_system: Zeroable::zero(),
                    position: Position { x: 1, y: 1 },
                    color: 0
                },
                player_1_hash
            );

            
    // let bar_contract = IbarDispatcher {
    //     contract_address: deploy_with_world_address(bar::TEST_CLASS_HASH, world)
    // };

    //     let player2 = starknet::contract_address_const::<0x1338>();

    //     let position = Position { x: 1, y: 2 };

    //     // Initialize the Game with player 1

    //     let (world_address, game_id, player_id) = create_game(position);
    //     let world = IWorldDispatcher { contract_address: world_address };

    //     // Set the players commitments
    //     let player_1_commit: u8 = SCISSORS;
    //     let player_2_commit: u8 = PAPER;

    //     // Set the player's secret salt. For the test its just different, client will send truly random
    //     let player_1_salt: felt252 = '0'.into();
    //     let player_2_salt: felt252 = '1'.into();

    //     // Precompute the player's hashes of the commitment
    //     let player_1_hash: felt252 = hash_commit(player_1_commit, player_1_salt);
    //     // 2009223828159094249133836233609177144843200658049525927969960152896456298759
    //     let player_2_hash: felt252 = hash_commit(player_2_commit, player_2_salt);
    //     // 2806284947926389905430919905847339941440916216293502548836266069780263106727

    //     // Make player1 the caller
    //     starknet::testing::set_contract_address(player1);

    //     // Player 1 commits
    //     player_commit(world, game_id, player_1_hash, position);

    //     // Make player2 the caller
    //     starknet::testing::set_contract_address(player2);

    //     // Player 2 commits
    //     player_commit(world, game_id, player_2_hash, position);

    //     // Make player1 the caller
    //     starknet::testing::set_contract_address(player1);

    //     // Player 1 reveals
    //     player_reveal(world, game_id, player_1_hash, player_1_commit, player_1_salt, position);

    //     // Make player2 the caller
    //     starknet::testing::set_contract_address(player2);

    //     // Player 2 reveals
    //     player_reveal(world, game_id, player_1_hash, player_2_commit, player_2_salt, position);
    // // TODO Event with winner?

    }
}
