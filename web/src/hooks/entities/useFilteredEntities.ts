import { useQuery } from '@tanstack/react-query'
import { useDojo } from '@/DojoContext.tsx'
import { getComponentValue, setComponent } from '@latticexyz/recs'
import { getEntityIdFromKeys } from '@dojoengine/utils'
import { BLOCK_TIME } from '@/global/constants.ts'
import isEqual from 'lodash/isEqual'
import { useAtom } from 'jotai'
import { isCanvasRenderAtom } from '@/global/states.ts'

export function useFilteredEntities(
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
) {
  const {
    setup: {
      components: {
        Color,
        Owner,
        PixelType,
      },
      network: { graphSdk },
    },
  } = useDojo()

  const [isCanvasRender, setIsCanvasRender] = useAtom(isCanvasRenderAtom)
  return useQuery({
    queryKey: ['filtered-entitities', xMin, xMax, yMin, yMax],
    queryFn: async () => {
      const {data} = await graphSdk.all_filtered_entities({first: 65536, xMin, xMax, yMin, yMax})
      if (!data || !data.colorComponents?.edges) return { colorComponents: { edges: [] } }
      for (const edge of data.colorComponents.edges) {
        if (!edge || !edge.node) continue
        const { x, y, r, g, b } = edge.node
        const color = { x, y, r, g, b }
        const entityId = getEntityIdFromKeys([ BigInt(x), BigInt(y) ])
        const currentColor = getComponentValue(Color, entityId)

        // do not update if it's already equal
        if (isEqual(currentColor, color)) continue

        // to update latticexyz indexer
        setComponent(Color, entityId, {x, y, r, g, b})
      }

      if (!data || !data.ownerComponents?.edges) return { ownerComponents: { edges: [] } }
      for (const edge of data.ownerComponents.edges) {
        if (!edge || !edge.node) continue
        const { x, y, address } = edge.node
        const owner = address
        const entityId = getEntityIdFromKeys([ BigInt(x), BigInt(y) ])
        const currentOwner = getComponentValue(Owner, entityId)

        // do not update if it's already equal
        if (isEqual(currentOwner, owner)) continue

        // to update latticexyz indexer
        setComponent(Owner, entityId, { x, y, address: owner })
      }

      if (!data || !data.pixeltypeComponents?.edges) return { pixeltypeComponents: { edges: [] } }
      for (const edge of data.pixeltypeComponents.edges) {
        if (!edge || !edge.node) continue
        const { x, y, name } = edge.node
        const pixelType = name
        const entityId = getEntityIdFromKeys([ BigInt(x), BigInt(y) ])
        const currentPixelType = getComponentValue(PixelType, entityId)

        // do not update if it's already equal
        if (isEqual(currentPixelType, pixelType)) continue

        // to update latticexyz indexer
        setComponent(PixelType, entityId, { x, y, name: pixelType })
      }

      return data
    },
    onSuccess: () => {
      setIsCanvasRender(true)
      if (isCanvasRender) return
    },
    refetchInterval: BLOCK_TIME,
  })
}
