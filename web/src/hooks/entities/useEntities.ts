import { useQuery } from '@tanstack/react-query'
import { useDojo } from '@/DojoContext'
import { BLOCK_TIME } from '@/global/constants'
import { convertToDecimal } from '@/global/utils'
import { getEntityIdFromKeys } from '@dojoengine/utils'
import { getComponentValue, setComponent } from '@latticexyz/recs'
import { Color, Text } from '@/generated/graphql.ts';
import _ from 'lodash'

const useEntities = () => {
  const {
    setup: {
      components: { Color, Text },
      network: { graphSdk }
    }
  } = useDojo()
  return useQuery(
    // /offset-x, offset-y as qury key
    ['entities' ],
    async () => {
      const { data } = await graphSdk.getEntities()
      if (!data || !data?.entities?.edges || ! data?.entities?.edges) return { entities: { edges: [] } }
      for (const edge of data.entities.edges) {
        if (!edge?.node?.components) continue
        const keys = edge.node.keys
        if (!keys) continue
        const entityId = getEntityIdFromKeys(keys.map(key => BigInt(convertToDecimal(key ?? '0x0'))))
        if (!edge?.node?.components) continue
        // eslint-disable-next-line no-unsafe-optional-chaining
        for (const component of edge?.node?.components) {
          if (!component) continue
          if (component.__typename === 'Color') {
            const color = component as Color
            delete color["__typename"]
            const currentColor = getComponentValue(Color, entityId)
            if (!_.isEqual(currentColor, color)) {
              setComponent(Color, entityId, { x: color.x, y: color.y, r: color.r, g: color.g, b: color.b })
            }
          }
          if (component.__typename === 'Text') {
            const text = component as Text
            delete text["__typename"]
            const currentText = getComponentValue(Text, entityId)
            if (!_.isEqual(text, currentText)) setComponent(Text, entityId, { x: text.x, y: text.y, string: text.string })
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
