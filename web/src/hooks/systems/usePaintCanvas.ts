import { useDojo } from '@/DojoContext.tsx'
import { useMutation } from '@tanstack/react-query'
import { TransactionFinalityStatus, TransactionStatus } from 'starknet'

type UsePaintCanvasMutationProps = {
  position: [number, number],
  rgbColor: { r: number, g: number, b: number } | [number, number, number]
}
export function usePaintCanvas(){
  const {
    setup: {
      systemCalls: {put_color},
    },
    account: { account }
  } = useDojo()

  return useMutation({
    mutationKey: ['usePaintCanvas'],
    mutationFn: async ({position, rgbColor}: UsePaintCanvasMutationProps) => {
      const tx = await put_color(account, position, Object.values(rgbColor))
      const response = await account.waitForTransaction(tx.transaction_hash)
      if (response.status === TransactionStatus.REJECTED) {
        throw new Error('tx was rejected')
      } else if (response.finality_status !== TransactionFinalityStatus.ACCEPTED_ON_L2) {
        throw new Error('tx did not succeed')
      }
      return response
    },
    onError: (error) => console.error(`usePaintCanvas Mutation Error: ${error}`)
  })
}
