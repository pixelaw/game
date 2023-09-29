import { useMutation } from '@tanstack/react-query'
import { useDojo } from '@/DojoContext'
import { useAtomValue } from 'jotai'
import { rgbColorAtom } from '@/global/states.ts'
import { TransactionFinalityStatus, TransactionStatus } from 'starknet'

const usePaint = (position: [number, number]) => {
  const {
    setup: {
      systemCalls: {put_color},
    },
    account: { account }
  } = useDojo()

  const rgbColor = useAtomValue(rgbColorAtom)

  return useMutation(
    ['usePaint', position[0], position[1]],
    async () => {
      const tx = await put_color(account, position, rgbColor)
      const response = await account.waitForTransaction(tx.transaction_hash)
      if (response.status === TransactionStatus.REJECTED) {
        throw new Error('tx was rejected')
      } else if (response.finality_status !== TransactionFinalityStatus.ACCEPTED_ON_L2) {
        throw new Error('tx did not succeed')
      }
      return response
    },
    {
      onError: error => console.error("usePaint", error),
    },

  )
}

export default usePaint
