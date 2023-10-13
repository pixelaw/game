import { SetupNetworkResult } from "./setupNetwork";
import { Account } from 'starknet'
export function createSystemCalls(
    { execute }: SetupNetworkResult,
) {
    const put_color = async (
        signer: Account,
        position: number[],
        color: number[]

    ) => {

        return await execute(signer, "paint_actions", 'put_color', [
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
      put_color
    };
}
