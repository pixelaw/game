#[derive(Component, Copy, Drop, Serde, SerdeLen, PartialEq)]
struct Color {
    #[key]
    x: u64,
    #[key]
    y: u64,
    r: u8,
    g: u8,
    b: u8
}
