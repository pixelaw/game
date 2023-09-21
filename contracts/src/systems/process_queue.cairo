

#[system]
mod process_queue_system {

    use array::ArrayTrait;
    use traits::Into;
    use dojo::world::Context;

    #[derive(Drop, starknet::Event)]
    struct QueueStarted {
      id: u64,
      execution: felt252,
      arguments: Span<felt252>
    }

    #[derive(Drop, starknet::Event)]
    struct QueueFinished {
      id: u64
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
      QueueStarted: QueueStarted,
      QueueFinished: QueueFinished
    }




  fn execute(
        ctx: Context,
        id: u64,
        execution: felt252,
        arguments: Array<felt252>
    ) {
        assert(id <= starknet::get_block_timestamp() * 1_000, 'unlock time not passed');
        ctx.world.execute(execution, arguments);
        emit!(ctx.world, Event::QueueFinished(QueueFinished { id }));
    }
}
