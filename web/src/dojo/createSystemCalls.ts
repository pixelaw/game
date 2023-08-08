import { SetupNetworkResult } from "./setupNetwork";
import {number} from "starknet";


export function createSystemCalls(
    { execute, syncWorker }: SetupNetworkResult,
) {
    const spawn_pixel_system = async (
        position: number[],
        pixel_type: number.BigNumberish

    ) => {

        const tx = await execute("spawn_pixel_system", [
            position[0],
            position[1],
            pixel_type,
            0

        ]);
        await syncWorker.sync(tx.transaction_hash);
    };

    const put_color = async (
        position: number[],
        color: number[]

    ) => {

        const tx = await execute("put_color_system", [
            position[0],
            position[1],
            color[0],
            color[1],
            color[2]
        ]);
        await syncWorker.sync(tx.transaction_hash);
    };

    // const put_color = async (
    //     position: number[],
    //     color: number[]
    //
    // ) => {
    //
    //     const tx = await execute("put_color", [
    //         position[0],
    //         position[1],
    //         color[0],
    //         color[1],
    //         color[2]
    //     ]);
    //     wsProvider.sendMessage({txHash: tx.transaction_hash})
    //     await syncWorker.sync(tx.transaction_hash);
    // };

    return {
        spawn_pixel_system, put_color, reset: (something: any) => something
    };
}