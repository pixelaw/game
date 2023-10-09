import { useQuery } from '@tanstack/react-query'
import { useDojo } from '@/DojoContext.tsx'
import { getEntityIdFromKeys } from '@dojoengine/utils'
import { getComponentValue, setComponent } from '@latticexyz/recs'
import isEqual from 'lodash/isEqual'
import { BLOCK_TIME } from '@/global/constants.ts'

export function useNeedsAttention() {
  const {
    account: {
      account,
    },
    setup: {
      components: {
        Owner,
        NeedsAttention,
      },
      network: { graphSdk },
    },
  } = useDojo()

  return useQuery({
    queryKey: [ 'needs-aatention' ],
    queryFn: async () => {
      const { data } = await graphSdk.getNeedsAttention({ first: 65536, address: account.address })
      if (!data || !data.ownerComponents?.edges) return { ownerComponents: { edges: [] } }
      for (const edge of data.ownerComponents.edges) {
        if (!edge || !edge.node) continue
        const { x, y, address } = edge.node
        const owner = { x, y, address }
        const entityId = getEntityIdFromKeys([ BigInt(x), BigInt(y) ])
        const currentOwner = getComponentValue(Owner, entityId)

        // do not update if it's already equal
        if (isEqual(currentOwner, owner)) continue

        setComponent(Owner, entityId, owner)
      }

      if (!data || !data.needsattentionComponents?.edges) return { needsattentionComponents: { edges: [] } }
      for (const edge of data.needsattentionComponents.edges) {
        if (!edge || !edge.node) continue
        const { x, y, value } = edge.node
        const needsAttentionValue = { x, y, value }
        const entityId = getEntityIdFromKeys([ BigInt(x), BigInt(y) ])
        const currentNeedsAttentionValue = getComponentValue(NeedsAttention, entityId)

        // do not update if it's already equal
        if (isEqual(currentNeedsAttentionValue, needsAttentionValue)) continue

        setComponent(NeedsAttention, entityId, needsAttentionValue)
      }

      return data
    },
    refetchInterval: BLOCK_TIME
  })
}
