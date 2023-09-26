import { Pixel } from './types'

const createDefaultPixels = (height: number, width: number) => {
  const defaultPixels: Pixel[] = []
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      defaultPixels.push({
        x,
        y,
        color: {
          r: 0,
          g: 0,
          b: 0
        },
        text: ''
      })
    }
  }
  return defaultPixels
}

export default createDefaultPixels
