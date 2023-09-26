import { Pixel } from './types'
import { DEFAULT_COLOR } from './constants'

const createDefaultPixels = (height: number, width: number) => {
  const defaultPixels: Pixel[] = []
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      defaultPixels.push({
        x,
        y,
        color: DEFAULT_COLOR,
        text: ''
      })
    }
  }
  return defaultPixels
}

export default createDefaultPixels
