import { useMutation } from '@tanstack/react-query'
import { useDojo } from '@/DojoContext'
import { useAtomValue } from 'jotai'
import { rgbColorAtom } from '@/global/states.ts'

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
      await put_color(account, position, rgbColor)
    },
    {
      onError: error => console.error("usePaint", error)
    }
  )
}

export default usePaint
