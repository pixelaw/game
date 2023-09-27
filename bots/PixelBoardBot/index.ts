// Importing necessary modules
import createBoard from './createBoard'
import createDefaultPixels from './createDefaultPixels'
import getState from './getState'
import uploadBoard from './uploadBoard'
import getEnv from '../utils/getEnv'

// Configuration object for the canvas and pixel size, and refresh rate
const pixelBoardConfig = {
  canvasSize: {
    width: getEnv<number>('CANVAS_WIDTH', 500),
    height: getEnv<number>('CANVAS_HEIGHT', 500)
  },
  pixelSize: {
    height: getEnv<number>('PIXEL_HEIGHT', 1),
    width: getEnv<number>('PIXEL_WIDTH', 1)
  },
  refreshRate: getEnv<number>('PIXEL_BOARD_REFRESH_RATE', 5_000)
}

// Creating default pixels based on the canvas size
const defaultPixelState = createDefaultPixels(pixelBoardConfig.canvasSize.height, pixelBoardConfig.canvasSize.width)

// Main loop function that gets the state, creates the board, and uploads it
async function mainLoop() {
  try {
    const pixelState = await getState()
    const board = createBoard(pixelState, pixelBoardConfig, defaultPixelState)
    await uploadBoard(board)
  } catch (error) {
    console.error("Error with PixelBoardBot", error)
  }

  // Setting the loop to run at the specified refresh rate
  setTimeout(mainLoop, pixelBoardConfig.refreshRate);
}

// Function to start the bot
async function startBot () {
  console.info("PixelBoardBot starting")
  await mainLoop()
}

// Exporting the start function as default
export default startBot
