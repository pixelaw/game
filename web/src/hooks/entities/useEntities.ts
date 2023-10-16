import { useQuery } from '@tanstack/react-query'
import { useDojo } from '@/DojoContext'
import { BLOCK_TIME } from '@/global/constants'
import { getEntityIdFromKeys } from '@dojoengine/utils'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
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
        const entityId = getEntityIdFromKeys(
          keys.split("/")
            .filter(key => !!key)
            .map(key => BigInt(key))
        )
        if (!edge?.node?.models) continue
        // eslint-disable-next-line no-unsafe-optional-chaining
        for (const model of edge?.node?.models) {
          if (!model) continue
          const componentType = componentTypes.find(
            componentType => componentType.metadata?.name === model?.__typename
          )
          if (!componentType) continue
          delete model["__typename"]
          const currentValue = getComponentValue(componentType, entityId)

          // do not update if it's already equal
          if (_.isEqual(model, currentValue)) continue

          setComponent(componentType, entityId, model)
        }
      }
      return data

    },
    {
      refetchInterval: BLOCK_TIME
    })
}

export default useEntities
