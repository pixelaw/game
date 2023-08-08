#[derive(Component, Copy, Drop, Serde, SerdeLen, PartialEq)]
struct Text {
    string: felt252, 
}
