#[system]
mod schedule_queue_system {
    use array::ArrayTrait;
    use traits::Into;
    use dojo::world::Context;
    use pixelaw::events::{Event, QueueStarted};

    fn execute(
        ctx: Context,
        unlock: u64,
        execution: felt252,
        arguments: Array<felt252>
    ) {
        let random_number = starknet::get_block_timestamp() % 1_000;
        let id = unlock * 1_000 + random_number;

        emit!(
            ctx.world,
            Event::QueueStarted(QueueStarted {
                id,
                execution,
                arguments: arguments.span()
            })
        );
    }
}