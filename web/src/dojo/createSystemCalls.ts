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
    { Color, Owner, PixelType, NeedsAttention }: ClientComponents
) {
    const put_color = async (
        signer: Account,
        position: number[],
        color: number[]

    ) => {
      const entityId = getEntityIdFromKeys(position.map(p => BigInt(p))) as EntityIndex

      const colorId = uuid()
      Color.addOverride(colorId, {
        entity: entityId,
        value: { x: position[0], y: position[1], r: color[0], g: color[1], b: color[2]}
      })

      const ownerId  = uuid()
      Owner.addOverride(ownerId, {
        entity: entityId,
        value: { x: position[0], y: position[1], address: signer.address }
      })

      const pixelTypeId = uuid()
      PixelType.addOverride(pixelTypeId, {
        entity: entityId,
        value: { x: position[0], y: position[1], name: PIXEL_TYPES.paint}
      })

      const needsAttentionId = uuid()
      NeedsAttention.addOverride(needsAttentionId, {
        entity: entityId,
        value: { x: position[0], y: position[1], value: false }
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
        Color.removeOverride(colorId)
        Owner.removeOverride(ownerId)
        PixelType.removeOverride(pixelTypeId)
        NeedsAttention.removeOverride(needsAttentionId)
      } finally {
        Color.removeOverride(colorId)
        Owner.removeOverride(ownerId)
        PixelType.removeOverride(pixelTypeId)
        NeedsAttention.removeOverride(needsAttentionId)
      }
    };

    return {
      put_color
    };
}
