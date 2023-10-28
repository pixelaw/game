#[derive(Model, Copy, Drop, Serde)]
struct Text {
    #[key]
    x: u64,
    #[key]
    y: u64,
    string: felt252,
}
