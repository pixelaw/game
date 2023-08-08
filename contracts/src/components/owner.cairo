#[derive(Component, Copy, Drop, Serde, SerdeLen, PartialEq)]
struct Owner {
    address: felt252, 
}
