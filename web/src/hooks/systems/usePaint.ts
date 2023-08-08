import {useMutation} from "@tanstack/react-query";
import {useDojo} from "../../DojoContext";
import {useAtomValue} from "jotai";
import {rgbColorAtom} from "../../global/states";

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
      await put_color(position, rgbColor)
    },
    {
      onError: error => console.error("usePaint", error)
    }
  )
}

export default usePaint