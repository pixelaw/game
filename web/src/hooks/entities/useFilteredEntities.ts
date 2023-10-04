import { useQuery } from '@tanstack/react-query'
import { useDojo } from '@/DojoContext.tsx'
import { getComponentValue, setComponent } from '@latticexyz/recs'
import { getEntityIdFromKeys } from '@dojoengine/utils'
import { BLOCK_TIME } from '@/global/constants.ts'
import _ from 'lodash'

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
  //0 20 0 8
  // console.info('params', { xMin, xMax, yMin, yMax })
  return useQuery({
    queryKey: [ 'filtered-entitities', xMin, xMax, yMin, yMax ],
    queryFn: async () => {
      const { data } = await graphSdk.all_filtered_entities({ xMin, xMax, yMin, yMax })
      if (!data || !data.colorComponents?.edges) return { colorComponents: { edges: [] } }
      for (const edge of data.colorComponents.edges) {
        if (!edge || !edge.node) return
        const { x, y, r, g, b } = edge.node
        const color = { x, y, r, g, b }
        const entityId = getEntityIdFromKeys([ BigInt(x), BigInt(y) ])
        const currentColor = getComponentValue(Color, entityId)
        if (!_.isEqual(currentColor, color)) {
          setComponent(Color, entityId, { x, y, r, g, b })
        }
      }

      return data
    },
    refetchInterval: BLOCK_TIME,
  })
}
