# PixeLAW Contracts

## Interacting With Your Local World

Explore and interact with your locally deployed world! This guide will help you fetch schemas, inspect entities, and execute actions using `sozo`.

If you have followed the example exactly and deployed on Katana, you can use the world address generated to either:

- use as an argument to `--world` when calling `sozo` commands
- add it to [Scarb.toml](Scarb.toml) under `[tool.dojo.env]` table like so

    ```toml
    [tool.dojo.env]
    world_address = "<world_address>"
    ```

- set it as an environment variable

    ```bash
    export DOJO_WORLD_ADDRESS="<world_address>"
    ```

### Fetching Component Schemas

Let's start by fetching the schema for the `Moves` component. Use the following command
```bash
sozo component schema Moves
```

You should get this in return:

```rust
struct Moves {
   remaining: u8
}
```
This structure indicates that the `Moves` component keeps track of the remaining moves as an 8-bit unsigned integer.

### Inspecting an Entity's Component

Let's check the remaining moves for an entity. In our examples, the entity is based on the caller address, so we'll use the address of the **first** Katana account as an example.

```bash
sozo component entity Moves 0x03ee9e18edc71a6df30ac3aca2e0b02a198fbce19b7480a63a0d71cbd76652e0
```

If you haven't made an entity yet, it will return `0`.

### Adding an Entity

No entity? No problem! You can add an entity to the world by executing the `spawn` system. Remember, there's no need to pass any call data as the system uses the caller's address for the database.

```bash
sozo execute spawn
```

### Refetching an Entity's Component

After adding an entity, let's refetch the remaining moves with the same command we used earlier:

```bash
sozo component entity Moves 0x03ee9e18edc71a6df30ac3aca2e0b02a198fbce19b7480a63a0d71cbd76652e0
```

#### Passing the world address as an argument

We can get the same results by executing this command

```bash
sozo component entity Moves --world <WORLD_ADDRESS> 0x03ee9e18edc71a6df30ac3aca2e0b02a198fbce19b7480a63a0d71cbd76652e0
```

Congratulations! You now have `10` remaining moves! You've made it this far, keep up the momentum and keep exploring your world!


#### Next steps:

Make sure to read the [Offical Dojo Book](https://book.dojoengine.org/index.html) for detailed instructions including theory and best practices.

---
