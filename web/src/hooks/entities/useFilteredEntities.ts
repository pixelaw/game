import { useQuery } from '@tanstack/react-query'
import { useDojo } from '@/DojoContext.tsx'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getComponentValue, setComponent } from '@latticexyz/recs'
import { getEntityIdFromKeys } from '@dojoengine/utils'
import { BLOCK_TIME } from '@/global/constants.ts'
import isEqual from 'lodash/isEqual'

export function useFilteredEntities(
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
) {
  const {
    setup: {
      components: {
        _Color,
        _Owner,
        _PixelType,
      },
      network: { graphSdk },
    },
  } = useDojo()

  return useQuery({
    queryKey: ['filtered-entitities', xMin, xMax, yMin, yMax],
    queryFn: async () => {
      const {data} = await graphSdk.all_filtered_entities({first: 65536, xMin, xMax, yMin, yMax})
      if (!data || !data.colorModels?.edges) return { colorModels: { edges: [] } }
      for (const edge of data.colorModels.edges) {
        if (!edge || !edge.node) continue
        const { x, y, r, g, b } = edge.node
        const color = { x, y, r, g, b }
        const entityId = getEntityIdFromKeys([ BigInt(x), BigInt(y) ])
        const currentColor = getComponentValue(_Color, entityId)

        // do not update if it's already equal
        if (isEqual(currentColor, color)) continue

        // to update latticexyz indexer
        setComponent(_Color, entityId, {x, y, r, g, b})
      }

      if (!data || !data.ownerModels?.edges) return { ownerModels: { edges: [] } }
      for (const edge of data.ownerModels.edges) {
        if (!edge || !edge.node) continue
        const { x, y, address } = edge.node
        const owner = address
        const entityId = getEntityIdFromKeys([ BigInt(x), BigInt(y) ])
        const currentOwner = getComponentValue(_Owner, entityId)

        // do not update if it's already equal
        if (isEqual(currentOwner, owner)) continue

        // to update latticexyz indexer
        setComponent(_Owner, entityId, { x, y, address: owner })
      }

      if (!data || !data.pixeltypeModels?.edges) return { pixeltypeModels: { edges: [] } }
      for (const edge of data.pixeltypeModels.edges) {
        if (!edge || !edge.node) continue
        const { x, y, name } = edge.node
        const pixelType = name
        const entityId = getEntityIdFromKeys([ BigInt(x), BigInt(y) ])
        const currentPixelType = getComponentValue(_PixelType, entityId)

        // do not update if it's already equal
        if (isEqual(currentPixelType, pixelType)) continue

        // to update latticexyz indexer
        setComponent(_PixelType, entityId, { x, y, name: pixelType })
      }

      return data
    },
    refetchInterval: BLOCK_TIME,
  })
}
