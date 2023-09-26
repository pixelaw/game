import { createCanvas } from 'canvas'
import * as fs from 'fs'
import { Pixel } from './types'
import { mkdirp } from 'mkdirp'

type BoardConfig = {
  outputPath: string,
  canvasSize: {
    height: number,
    width: number
  },
  pixelSize: {
    height: number,
    width: number
  }
}

const createBoard = (data: Pixel[], config: BoardConfig, defaultPixels?: Pixel[]) => {
  console.info("creating board")
  const canvas = createCanvas(config.canvasSize.width, config.canvasSize.height)
  const ctx = canvas.getContext("2d")

  const dataPoints = new Set(data.map(({x, y}) => `${x},${y}`))

  const filteredPixels = (defaultPixels ?? []).filter(({x, y}) => !dataPoints.has(`${x},${y}`))

  const board = [...data, ...filteredPixels]

  board.forEach(item => {
    ctx.fillStyle = `rgb(${item.color.r}, ${item.color.g}, ${item.color.b})`;
    ctx.fillRect(item.x, item.y, config.pixelSize.width, config.pixelSize.height);
    ctx.font = '10px Arial'; // Adjust size as needed
    ctx.fillText(item.text, item.x, item.y);
  });

  const pngBuffer = canvas.toBuffer('image/png')
  mkdirp.sync(config.outputPath.replace(/\/[^/]+$/, ''))
  fs.writeFileSync(config.outputPath, pngBuffer)
  console.info("created board at: ", config.outputPath)
}

export default createBoard