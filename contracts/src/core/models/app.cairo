use pixelaw::core::models::position::Position;

#[derive(Model, Copy, Drop, Serde)]
struct App {
    #[key]
    position: Position,
    name: felt252,
}
