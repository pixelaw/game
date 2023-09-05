#[derive(Component, Copy, Drop, Serde, SerdeLen, PartialEq)]
struct ColorCount {
    #[key]
    x: u64,
    #[key]
    y: u64,
    count: u128
}
