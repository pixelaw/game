#[derive(Component, Copy, Drop, Serde, SerdeLen, PartialEq)]
struct Permission {
    allowed: bool, 
}
