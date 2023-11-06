import { SetupNetworkResult } from "./setupNetwork";
import { Account } from 'starknet'
import { getEntityIdFromKeys, getEvents, setComponentsFromEvents } from '@dojoengine/utils'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EntityIndex } from "@latticexyz/recs";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from '@/dojo/createClientComponents'

const PIXEL_TYPES = {
  paint: "0x7061696e74"
}
export function createSystemCalls(
    { execute, contractComponents }: SetupNetworkResult,
    { Pixel }: ClientComponents
) {
    const put_color = async (
        signer: Account,
        position: number[],
        color: string

    ) => {
      const entityId = getEntityIdFromKeys(position.map(p => BigInt(p))) as EntityIndex

      const pixelId = uuid()
      Pixel.addOverride(pixelId, {
        entity: entityId,
        value: {
          x: position[0],
          y: position[1],
          app: PIXEL_TYPES['paint'],
          color: Number(color),
          owner: signer.address,
        }
      })

      try {
        const tx = await execute(signer, "paint_actions", 'put_color', [
          position[0],
          position[1],
          position[0],
          position[1],
          color[0],
          color[1],
          color[2]
        ]);

        const receipt = await signer.waitForTransaction(tx.transaction_hash, { retryInterval: 100})
        setComponentsFromEvents(contractComponents, getEvents(receipt))
      } catch (e) {
        console.error(e)
        Pixel.removeOverride(pixelId)
      } finally {
        Pixel.removeOverride(pixelId)
      }
    };

    return {
      put_color
    };
}
