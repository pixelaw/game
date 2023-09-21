import { useMutation } from '@tanstack/react-query'
import { useDojo } from '../../DojoContext'
import { useAtomValue } from 'jotai'
import { rgbColorAtom } from '@/global/states.ts'
import { sleep } from '@latticexyz/utils'

const PAINT = 482670636660

const usePaint = (position: [number, number]) => {
  const {
    systemCalls: {spawn_pixel_system, put_color},
  } = useDojo()

  const rgbColor = useAtomValue(rgbColorAtom)

  return useMutation(
    ['usePaint', position[0], position[1]],
    async () => {
      await spawn_pixel_system(position, PAINT)
      sleep(300)
      await put_color(position, rgbColor)
      sleep(300)
    },
    {
      onError: error => console.error("usePaint", error)
    }
  )
}

export default usePaint
