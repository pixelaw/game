#[derive(Model, Copy, Drop, Serde)]
struct Owner {
    #[key]
    x: u64,
    #[key]
    y: u64,
    address: felt252,
}
