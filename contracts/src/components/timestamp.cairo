#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Timestamp {
    created_at: u64,
    updated_at: u64,
}
