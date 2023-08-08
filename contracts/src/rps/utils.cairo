use array::ArrayTrait;
use traits::{Into, TryInto};
use poseidon::poseidon_hash_span;

// TODO: implement proper psuedo random number generator
fn random(seed: felt252, min: u128, max: u128) -> u128 {
    let seed: u256 = seed.into();
    let range = max - min;

    (seed.low % range) + min
}

fn hash_commit(commit: u8, salt: felt252) -> felt252 {
    let mut hash_span = ArrayTrait::<felt252>::new();
    hash_span.append(commit.into());
    hash_span.append(salt.into());

    poseidon_hash_span(hash_span.span())
}
