#[derive(Component, Copy, Drop, Serde, SerdeLen, PartialEq)]
struct Position {
    x: u64,
    y: u64
}
