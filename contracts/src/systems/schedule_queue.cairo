#[system]
mod schedule_queue_system {
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
