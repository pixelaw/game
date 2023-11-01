use starknet::{ContractAddress, ClassHash};

#[derive(Copy, Drop, Serde, Introspect)]
struct Position {
    x: u64,
    y: u64
}


#[derive(Copy, Drop, Serde, Introspect)]
struct Color {
    r: u8,
    g: u8,
    b: u8
}

#[derive(Copy, Drop, Serde)]
struct PixelUpdate {
    position: Position,
    color: Option<Color>,
    owner: Option<ContractAddress>,
    app: Option<ContractAddress>,
    text: Option<felt252>,
    timestamp: Option<u64>,
    alert: Option<felt252>
}

#[derive(Model, Copy, Drop, Serde)]
struct Pixel {
    // System properties
    #[key]
    position: Position,
    created_at: u64,
    updated_at: u64,
    // User-changeable properties
    alert: felt252,
    app: ContractAddress,
    color: Color,
    owner: ContractAddress,
    text: felt252,
    timestamp: u64,
}

