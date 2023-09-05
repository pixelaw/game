#[derive(Component, Copy, Drop, Serde, SerdeLen, PartialEq)]
struct PixelType {
    #[key]
    x: u64,
    #[key]
    y: u64,
    name: felt252, 
}
