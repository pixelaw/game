#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Game {
    game_id: u32,
    state: u8,
    player1: felt252,
    player2: felt252,
    player1_hash: felt252,
    player2_hash: felt252,
    player1_commit: u8,
    player2_commit: u8,
    started_timestamp: u64,
    winner: u8
}
