#[derive(Component, Copy, Drop, Serde, SerdeLen, PartialEq)]
struct Owner {
    #[key]
    x: u64,
    #[key]
    y: u64,
    address: felt252, 
}
