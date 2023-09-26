import { Pixel } from './types'
import randomNumber from '../utils/randomNumber'

const getState: () => Promise<Pixel[]> = async () => {
  const pixels: Pixel[] = []

  // TODO change dummy data with actual state of all the pixels from Torii
  for (let y = 0; y < 500; y++) {
    for (let x = 0; x < 500; x++) {
      if (x % 2 === 0 && x % 3 === 0 && y % 2 !== 0 && y % 3 !== 0) pixels.push({
        x,
        y,
        color: {
          r: randomNumber(0, 255),
          g: randomNumber(0, 255),
          b: randomNumber(0, 255)
        },
        text: '🐍'
      })
    }
  }
  return pixels
}

export default getState
