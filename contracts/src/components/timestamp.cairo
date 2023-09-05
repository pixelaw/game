#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Timestamp {
    #[key]
    x: u64,
    #[key]
    y: u64,
    created_at: u64,
    updated_at: u64,
}
