#[derive(Model, Copy, Drop, Serde)]
struct NeedsAttention {
    #[key]
    x: u64,
    #[key]
    y: u64,
    value: bool,
}
