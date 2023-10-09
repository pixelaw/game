#[derive(Model, Copy, Drop, Serde)]
struct Permission {
    #[key]
    x: u64,
    #[key]
    y: u64,
    #[key]
    caller_system: felt252,
    allowed: bool,
}
