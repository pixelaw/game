import { clsx } from 'clsx'
import React from 'react'
import { MAX_CELL_SIZE } from '@/global/constants'
import { DrawPanelProps } from '@/global/types'
import { useAtomValue } from 'jotai'
import { colorAtom, gameModeAtom } from '@/global/states'

function renderGrid(ctx: CanvasRenderingContext2D, options: {
  width: number,
  height: number,
  cellSize: number,
  positionX: number | undefined,
  positionY: number | undefined,
  selectedColor: string | undefined
}) {

  const cellSize = options.cellSize //pixels
  const bufferSize = 100 //pixels
  const canvasWidth = options.width //pixels
  const canvasHeight = options.height //pixels

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  // numberOfRows that can be rendered within the canvas size
  const numberOfRows = (canvasWidth + bufferSize) / cellSize
  // numberOfCols that can be rendered within the canvas size
  const numberOfCols = (canvasHeight + bufferSize) / cellSize

  for (let r = 0; r < numberOfRows; r++) {
    for (let c = 0; c < numberOfCols; c++) {
      const x = r * cellSize
      const y = c * cellSize


      if (r === options.positionX && c === options.positionY) {
        if (options.selectedColor) {
          ctx.fillStyle = options.selectedColor
        } else {
          ctx.fillStyle = '#2F1643'
        }
      } else {
        ctx.fillStyle = '#2F1643'
      }

      ctx.strokeStyle = '#2E0A3E'
      ctx.strokeRect(x, y, cellSize, cellSize)
      ctx.fillRect(x, y, cellSize, cellSize)

      ctx.fillStyle = '#FFFFFF'
      ctx.textAlign = 'center'
      ctx.fillText(`( ${r - 1}, ${c - 1} )`, x - (cellSize / 2), y - (cellSize / 2))
    }
  }
}

export default function DrawPanel(props: DrawPanelProps) {
  // const {
  //   setup: {
  //     components: {
  //       Color,
  //     },
  //   },
  // } = useDojo()

  // TODO: get the coordinates base on the visible cells/pixel in the container. Initial Value (0,0) and (18, 7)
  // const keys = position.map(p => BigInt(p))
  // const entityId = getEntityIdFromKeys(keys)

  // const color = useComponentValue(Color, entityId)

  //mode of the game
  const gameMode = useAtomValue(gameModeAtom)
  //user selected color for painting
  const selectedColor = useAtomValue(colorAtom)
  //zoom level
  const zoomLevel = props.zoom ?? 100
  //cell size or pixel size
  const cellSize = MAX_CELL_SIZE * (zoomLevel / 100)
  //canvas ref
  const gridCanvasRef = React.useRef<HTMLCanvasElement>()

  //For setting the color of the pixel, getting the x and y coordinates when clicking the pixel
  const [ positionX, setPositionX ] = React.useState(undefined)
  const [ positionY, setPositionY ] = React.useState(undefined)

  React.useEffect(() => {
    if (gridCanvasRef.current) {
      const ctx = gridCanvasRef.current.getContext('2d')
      if (!ctx) return

      renderGrid(ctx, {
        width: gridCanvasRef.current.width,
        height: gridCanvasRef.current.height,
        cellSize,
        positionX,
        positionY,
        selectedColor,
      })
    }
  })

  // for (let i = 0; i < props.dataToRender.length; i++) {
  //   const info = props.dataToRender[i]
  //
  //   switch (info.type) {
  //     case 'color':
  //       // renderColor(color, x, y)
  //       break
  //     case 'snake':
  //       // renderSnake(snake, x, y)
  //       break
  //   }
  // }
  // })

  function onClickCoordinates(clientX: number, clientY: number) {
    if (!gridCanvasRef.current) return

    switch (gameMode) {
      case 'paint': {
        const rect = gridCanvasRef.current.getBoundingClientRect()
        const x = clientX - rect.left - window.scrollX // pixel
        const y = clientY - rect.top - window.scrollY // pixel

        const gridX = Math.floor(x / cellSize)
        const gridY = Math.floor(y / cellSize)

        setPositionX(gridX)
        setPositionY(gridY)
        break
      }
      default: {
        console.error('unknown game mode', gameMode)
      }
    }
  }

  function toastMessage(message: string) {
    //TODO: Add react toastify
    alert(message)
  }


  // function mouseDown(clientX: number, clientY: number) {
  //   setPanning(true)
  //   mouseX = clientX
  //   mouseY = clientY
  //
  //   console.info('mouseDown', mouseX, mouseY)
  //
  //
  // }

  // function mouseMove(clientX: number, clientY: number) {
  //   if (panning) {
  //     setPanOffsetX(panOffsetX + clientX - mouseX)
  //     setPanOffsetY(panOffsetY + clientY - mouseY)
  //     mouseX = clientX
  //     mouseY = clientY
  //     console.info('mouseMove', mouseX, mouseY)
  //   }

  // if (gridCanvasRef.current) {
  //   const ctx = gridCanvasRef.current.getContext('2d')
  //   if (!ctx) return
  //
  //   renderGrid(ctx, {
  //     width: gridCanvasRef.current.width,
  //     height: gridCanvasRef.current.height,
  //     cellSize,
  //     panOffsetX,
  //     panOffsetY,
  //   })
  // }
  // }


  // TODO
  // Panning, setLocalStorage offset top left
  //Query the last cell within canvas view (param: offset value, canvasSize, height and width / cellSize)
  //local state of
  return (
    <React.Fragment>
      <div className={clsx([
        'mt-20 w-full h-[704px] ',
      ])}>
        <div className={clsx([
          ' h-full max-w-[1728px] overflow-auto',
        ])}>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/*@ts-ignore*/}
          <canvas ref={gridCanvasRef}
                  width={'11500'}
                  height={'11500'}
                  className={clsx([ 'cursor-pointer' ])}
                  onClick={(event) => {
                    selectedColor
                      ? onClickCoordinates(event.clientX, event.clientY)
                      : toastMessage('Please Select Color!')
                  }}
          />

        </div>
      </div>
    </React.Fragment>
  )
}
