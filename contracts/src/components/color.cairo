#[derive(Component, Copy, Drop, Serde, SerdeLen, PartialEq)]
struct Color {
    r: u8,
    g: u8,
    b: u8
}
