#[derive( Serde, Drop, Copy, PartialEq, Introspect)]
struct Position {
    x: u64,
    y: u64
}
