import { useMutation } from '@tanstack/react-query'
import { useDojo } from '../../DojoContext'
import { useAtomValue } from 'jotai'
import { rgbColorAtom } from '@/global/states.ts'

const PAINT = 482670636660

const usePaint = (position: [number, number]) => {
  const {
    setup: {
      systemCalls: {spawn_pixel_system, put_color},
    },
    account: { account }
  } = useDojo()

  const rgbColor = useAtomValue(rgbColorAtom)

  return useMutation(
    ['usePaint', position[0], position[1]],
    async () => {
      await spawn_pixel_system(account, position, PAINT)
      await put_color(account, position, rgbColor)
    },
    {
      onError: error => console.error("usePaint", error)
    }
  )
}

export default usePaint
