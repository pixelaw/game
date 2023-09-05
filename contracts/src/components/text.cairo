#[derive(Component, Copy, Drop, Serde, SerdeLen, PartialEq)]
struct Text {
    #[key]
    x: u64,
    #[key]
    y: u64,
    string: felt252, 
}
