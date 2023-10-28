#[derive(Model, Copy, Drop, Serde)]
struct App {
    #[key]
    x: u64,
    #[key]
    y: u64,
    name: felt252,
}
