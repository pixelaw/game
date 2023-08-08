use pixelaw::components::position::Position;

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct RPSType {
    commit_hash: felt252,
    play: u8,
    other_position: Position
}

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct SnakeType {
    author: felt252
}
