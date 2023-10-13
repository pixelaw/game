import { useQuery } from '@tanstack/react-query'
import { useDojo } from '@/DojoContext'
import { BLOCK_TIME } from '@/global/constants'
import { convertToDecimal } from '@/global/utils'
import { getEntityIdFromKeys } from '@dojoengine/utils'
import { Component, getComponentValue, setComponent } from '@latticexyz/recs'
import _ from 'lodash'

const useEntities = () => {
  const {
    setup: {
      components: { Color, Text, NeedsAttention, Timestamp, Owner, PixelType },
      network: { graphSdk }
    }
  } = useDojo()

  const componentTypes: Component[] = [Color, Text, NeedsAttention, Timestamp, Owner, PixelType]

  return useQuery(
    ['entities'],
    async () => {
      const { data } = await graphSdk.getEntities()
      if (!data || !data?.entities?.edges || ! data?.entities?.edges) return { entities: { edges: [] } }
      for (const edge of data.entities.edges) {
        if (!edge?.node?.models) continue
        const keys = edge.node.keys
        if (!keys) continue
        const entityId = getEntityIdFromKeys(keys.map(key => BigInt(convertToDecimal(key ?? '0x0'))))
        if (!edge?.node?.models) continue
        // eslint-disable-next-line no-unsafe-optional-chaining
        for (const component of edge?.node?.components) {
          if (!component) continue
          const componentType = componentTypes.find(componentType => componentType.metadata?.name === component?.__typename)
          if (!componentType) continue
          delete component["__typename"]
          const currentValue = getComponentValue(componentType, entityId)

          // do not update if it's already equal
          if (_.isEqual(componentType, currentValue)) return

          setComponent(componentType, entityId, component)
        }
      }
      return data

    },
    {
      refetchInterval: BLOCK_TIME
    })
}

export default useEntities
