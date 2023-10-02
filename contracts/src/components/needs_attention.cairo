#[derive(Component, Copy, Drop, Serde, SerdeLen, PartialEq)]
struct NeedsAttention {
    #[key]
    x: u64,
    #[key]
    y: u64,
    value: bool,
}
