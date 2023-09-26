import createBoard from './createBoard'
import createDefaultPixels from './createDefaultPixels'
import getState from './getState'

const OUTPUT_PATH = process.env.NODE_ENV === 'production' ? '../static/assets/placeholder/pixel-state.png' : '../web/public/assets/placeholder/pixel-state.png'

const config = {
  canvasSize: {
    width: 500,
    height: 500
  },
  pixelSize: {
    height: 1,
    width: 1
  },
  outputPath: OUTPUT_PATH,
  refreshRate: 5_000
}

const defaultPixels = createDefaultPixels(config.canvasSize.height, config.canvasSize.width)

async function loop() {
  try {
    const pixels = await getState()
    createBoard(pixels, config, defaultPixels)
  } catch (e) {
    console.error("Error with PixelBoardBot", e)
  }

  setTimeout(loop, config.refreshRate);
}



async function start () {
  console.info("PixelBoardBot starting")
  await loop()
}

export default start
