use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
struct App {
  #[key]
  system: ContractAddress,
  name: felt252
}
