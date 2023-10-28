use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use pixelaw::apps::snake::models::{Position, Moves, Direction};
use starknet::{ContractAddress, ClassHash};

#[starknet::interface]
trait IActions<TContractState> {
    fn spawn(self: @TContractState);
    fn move(self: @TContractState, direction: Direction);
}

#[dojo::contract]
mod actions {
    use starknet::{ContractAddress, get_caller_address};
    use pixelaw::apps::snake::models::{Position, Moves, Direction, Vec2};
    use pixelaw::apps::snake::utils::next_position;
    use super::IActions;

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Moved: Moved,
    }

    #[derive(Drop, starknet::Event)]
    struct Moved {
        player: ContractAddress,
        direction: Direction
    }

    // impl: implement functions specified in trait
    #[external(v0)]
    impl ActionsImpl of IActions<ContractState> {
        // ContractState is defined by system decorator expansion
        fn spawn(self: @ContractState) {
            let world = self.world_dispatcher.read();
            let player = get_caller_address();
            let position = get!(world, player, (Position));
            let moves = get!(world, player, (Moves));

            set!(
                world,
                (
                    Moves {
                        player, remaining: moves.remaining + 1, last_direction: Direction::None(())
                    },
                    Position {
                        player, vec: Vec2 { x: position.vec.x + 10, y: position.vec.y + 10 }
                    },
                )
            );
        }

        fn move(self: @ContractState, direction: Direction) {
            let world = self.world_dispatcher.read();
            let player = get_caller_address();
            let (mut position, mut moves) = get!(world, player, (Position, Moves));
            moves.remaining -= 1;
            moves.last_direction = direction;
            let next = next_position(position, direction);
            set!(world, (moves, next));
            emit!(world, Moved { player, direction });
            return ();
        }
    }
}
