// owner, position, color, text, timestamp
// owner, position, color, text, timestamp

#[system]
mod has_write_access_system {
    use dojo::world::Context;
    use traits::Into;
    use debug::PrintTrait;

    use pixelaw::components::color::Color;
    use pixelaw::components::owner::Owner;
    use pixelaw::components::permission::Permission;
    use pixelaw::components::position::Position;
    use pixelaw::components::text::Text;
    use pixelaw::components::timestamp::Timestamp;

    fn execute(ctx: Context, position: Position, caller_system: felt252) -> bool {
        // Check if calling system has permission
        caller_system.print();

        let permission = get!(ctx.world, (position.x, position.y, caller_system).into(), (Permission));
        if permission.allowed {
            return true;
        }

        // If caller is owner or not owned by anyone, allow
        // Retrieve the existing pixel at the specified position
        let owner = get !(ctx.world, (position.x, position.y).into(), (Owner));
        let origin: felt252 = ctx.origin.into();
        origin.print();
        owner.address.print();
        owner.address == ctx.origin.into() || owner.address == 0
    }
}
