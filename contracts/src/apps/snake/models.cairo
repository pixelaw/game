use array::ArrayTrait;
use core::debug::PrintTrait;
use starknet::ContractAddress;

#[derive(Serde, Copy, Drop, Introspect)]
enum Direction {
    None: (),
    Left: (),
    Right: (),
    Up: (),
    Down: (),
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

#[derive(Model, Copy, Drop, Serde)]
struct SnakeHead {
    #[key]
    x: u64,
    #[key]
    y: u64,
    length: u8,
    direction: Direction
}

#[derive(Model, Copy, Drop, Serde)]
struct SnakeSegment {
    #[key]
    id: u8,
    x: u64,
    y: u64
}


