import { useQuery } from '@tanstack/react-query'
import { useDojo } from '@/DojoContext.tsx'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EntityIndex, getComponentValue, setComponent } from '@latticexyz/recs'
import { getEntityIdFromKeys } from '@dojoengine/utils'
import { BLOCK_TIME } from '@/global/constants.ts'
import isEqual from 'lodash/isEqual'

export function useApps() {
  const {
    setup: {
      components: {
        AppBySystem,
        AppByName
      },
      network: { graphSdk },
    },
  } = useDojo()

  return useQuery({
    queryKey: ['apps'],
    queryFn: async () => {
      const {data} = await graphSdk.apps()
      if (!data || !data.appbysystemModels?.edges) return { appbysystemModels: { edges: [] } }
      for (const edge of data.appbysystemModels.edges) {
        if (!edge || !edge.node) continue
        const {name, system} = edge.node
        const nameId = getEntityIdFromKeys([ BigInt(name)]) as EntityIndex
        const systemId = getEntityIdFromKeys([BigInt(system)]) as EntityIndex

        const currentName = getComponentValue(AppByName, nameId)
        const currentSystem = getComponentValue(AppBySystem, systemId)

        // do not update if it's already equal
        if (!isEqual(currentName, { name, system })) setComponent(AppByName, nameId, { name, system })
        if (!isEqual(currentSystem, { name, system })) setComponent(AppBySystem, systemId, {name, system })
      }

      return data
    },
    refetchInterval: BLOCK_TIME,
  })
}
