use starknet::{ContractAddress, get_caller_address, ClassHash, get_contract_address};

use pixelaw::core::models::registry::Registry;



#[derive(Serde, Copy, Drop, Introspect)]
enum Direction {
    None: (),
    Left: (),
    Right: (),
    Up: (),
    Down: (),
}

#[derive(Copy, Drop, Serde, SerdeLen)]
struct Position {
    x: u64,
    y: u64
}


impl DirectionIntoFelt252 of Into<Direction, felt252> {
    fn into(self: Direction) -> felt252 {
        match self {
            Direction::None(()) => 0,
            Direction::Left(()) => 1,
            Direction::Right(()) => 2,
            Direction::Up(()) => 3,
            Direction::Down(()) => 4,
        }
    }
}
const U64_MAX: u64 = 0xFFFFFFFFFFFFFFFF;

fn get_position(direction: Direction, position: Position) -> Position {
    match direction {
        Direction::None => { position },
        Direction::Left => {
            if position.x == 0 {
                position
            } else {
                Position { x: position.x - 1, y: position.y }
            }
        },
        Direction::Right => {
            if position.x == U64_MAX {
                position
            } else {
                Position { x: position.x + 1, y: position.y }
            }
        },
        Direction::Up => {
            if position.y == 0 {
                position
            } else {
                Position { x: position.x, y: position.y - 1 }
            }
        },
        Direction::Down => {
            if position.y == U64_MAX {
                position
            } else {
                Position { x: position.x, y: position.y + 1 }
            }
        },
    }
}
