import {atom} from "jotai";
import {hexToRgb} from "./utils";

export const colorAtom = atom('#FFFFFF')
export const rgbColorAtom = atom(
  (get) => {
    if(colorAtom) return
    const res = hexToRgb(get(colorAtom))
    return res ? [res.r, res.g, res.b] : [0, 0, 0]
  }
)

export const unicodeAtom = atom("0x0")

export const viewModeAtom = atom<"Pixel" | "Game">("Pixel")

export const gameModeAtom = atom<"none" |"paint" | "rps" | "snake">("paint")

export const coordinatesAtom = atom<Record<string, number>>({
  x: 0,
  y: 0
})

export const zoomLevelAtom = atom<number>(50)

export const isCanvasRenderAtom = atom<boolean>(false)
