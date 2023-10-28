#[derive(Model, Copy, Drop, Serde)]
struct PixelType {
    #[key]
    x: u64,
    #[key]
    y: u64,
    name: felt252,
}
