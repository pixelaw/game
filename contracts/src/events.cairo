use dojo::world::{Context, IWorldDispatcherTrait};
use serde::Serde;
use array::{ArrayTrait, SpanTrait};
use pixelaw::components::color::Color;
use pixelaw::components::owner::Owner;
use pixelaw::components::text::Text;
use pixelaw::components::pixel_type::PixelType;

// helper function to emit events, eventually dojo will 
// have framework level event/logging
fn emit(ctx: Context, name: felt252, values: Span<felt252>) {
    let mut keys = array::ArrayTrait::new();
    keys.append(name);
    ctx.world.emit(keys, values);
}

#[derive(Drop, Serde)]
struct ColorUpdated {
    color: Color,
    caller: felt252,
}

#[derive(Drop, Serde)]
struct OwnerUpdated {
    owner: Owner,
    caller: felt252,
}

#[derive(Drop, Serde)]
struct TextUpdated {
    text: Text,
    caller: felt252,
}

#[derive(Drop, Serde)]
struct PixelTypeUpdated {
    pixel_type: PixelType,
    caller: felt252,
}

#[derive(Drop, starknet::Event)]
struct QueueStarted {
    id: usize,
    unlock: u64,
    execution: felt252,
    arguments: Span<felt252>
}

#[derive(Drop, starknet::Event)]
struct QueueFinished {
    id: usize
}
