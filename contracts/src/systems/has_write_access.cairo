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

        let permission_sk: Query = (position.x, position.y, caller_system).into();
        caller_system.print();

        let maybe_permission = try_get !(ctx.world, permission_sk, Permission);
        let permission = match maybe_permission {
            Option::Some(permission) => permission,
            Option::None(_) => Permission { allowed: false },
        };
        if permission.allowed {
            return true;
        }

        // If caller is owner or not owned by anyone, allow
        // Retrieve the existing pixel at the specified position
        let maybe_owner = try_get !(ctx.world, (position.x, position.y).into(), (Owner));
        let owner = match maybe_owner {
            Option::Some(owner) => owner,
            Option::None(_) => Owner { address: 0 },
        };
        let origin: felt252 = ctx.origin.into();
        origin.print();
        owner.address.print();
        owner.address == ctx.origin.into() || owner.address == 0
    }
}
