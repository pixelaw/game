import { useQuery } from '@tanstack/react-query'
import { useDojo } from '@/DojoContext'
import { BLOCK_TIME } from '@/global/constants'
import { convertToDecimal } from '@/global/utils'
import { getEntityIdFromKeys } from '@dojoengine/utils'
import { setComponent } from '@latticexyz/recs'
import { Color, Text } from '../../generated/graphql';

const useEntities = () => {
  const {
    setup: {
      components: { Color, Text },
      network: { graphSdk }
    }
  } = useDojo()
  return useQuery(
    ['entities'],
    async () => {
      const { data } = await graphSdk.getEntities()
      if (!data || !data?.entities?.edges || ! data?.entities?.edges) return { entities: { edges: [] } }
      for (const edge of data.entities.edges) {
        if (!edge?.node?.components) continue
        const keys = edge.node.keys
        if (!keys) continue
        const entityId = getEntityIdFromKeys(keys.map(key => BigInt(convertToDecimal(key ?? '0x0'))))
        if (!edge?.node?.components) continue
        for (const component of edge?.node?.components) {
          if (!component) continue
          if (component.__typename === 'Color') {
            const color = component as Color
            setComponent(Color, entityId, { x: color.x, y: color.y, r: color.r, g: color.g, b: color.b })
          }
          if (component.__typename === 'Text') {
            const text = component as Text
            setComponent(Text, entityId, { x: text.x, y: text.y, string: text.string })
          }
        }
      }
      return data

    },
    {
      refetchInterval: BLOCK_TIME
    })
}

export default useEntities
