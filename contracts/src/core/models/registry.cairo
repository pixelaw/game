use starknet::{ContractAddress, get_caller_address, ClassHash, get_contract_address, get_tx_info};

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use pixelaw::core::actions::{
    IActionsDispatcher as ICoreActionsDispatcher,
    IActionsDispatcherTrait as ICoreActionsDispatcherTrait
};


#[derive(Model, Copy, Drop, Serde)]
struct AppBySystem {
    #[key]
    system: ContractAddress,
    name: felt252
}

#[derive(Model, Copy, Drop, Serde)]
struct AppByName {
    #[key]
    name: felt252,
    system: ContractAddress
}

#[derive(Model, Copy, Drop, Serde)]
struct CoreActionsAddress {
    #[key]
    key: felt252,
    value: ContractAddress
}


