import { useQuery } from '@tanstack/react-query'
import { useDojo } from '@/DojoContext.tsx'
import { setComponent } from '@latticexyz/recs'
import { getEntityIdFromKeys } from '@dojoengine/utils'
import { BLOCK_TIME } from '@/global/constants.ts'

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
      },
      network: { graphSdk },
    },
  } = useDojo()

  return useQuery({
    queryKey: [ 'filteredEntities' ],
    queryFn: async () => {
      const { data } = await graphSdk.all_filtered_entities({ xMin, xMax, yMin, yMax })
      if (!data || !data.colorComponents?.edges) return { colorComponents: { edges: [] } }
      for (const edge of data.colorComponents.edges) {
        if (!edge || !edge.node) return
        const { x, y, r, g, b } = edge.node
        const entityId = getEntityIdFromKeys([ BigInt(x), BigInt(y) ])
        setComponent(Color, entityId, { x, y, r, g, b })
      }

      return {
        data,
      }
    },
    refetchInterval: BLOCK_TIME,
  })
}
