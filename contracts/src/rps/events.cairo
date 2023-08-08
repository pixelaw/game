#[derive(Drop, Serde)]
struct GameCreated {
    game_id: u32,
    creator: felt252
}
