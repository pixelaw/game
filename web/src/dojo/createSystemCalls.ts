import { SetupNetworkResult } from "./setupNetwork";
import { Account, BigNumberish } from 'starknet'
export function createSystemCalls(
    { execute }: SetupNetworkResult,
) {
    const spawn_pixel_system = async (
        signer: Account,
        position: number[],
        pixel_type: BigNumberish

    ) => {

        return await execute(signer, "spawn_pixel_system", [
            position[0],
            position[1],
            pixel_type,
            0

        ]);
    };

    const put_color = async (
        signer: Account,
        position: number[],
        color: number[]

    ) => {

        return await execute(signer, "put_color_system", [
            position[0],
            position[1],
            position[0],
            position[1],
            color[0],
            color[1],
            color[2]
        ]);
    };

    return {
        spawn_pixel_system, put_color
    };
}
