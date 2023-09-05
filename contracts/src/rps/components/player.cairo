#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Player {
    #[key]
    player_id: felt252,
    wins: u32
}

