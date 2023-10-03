import React from 'react'
import { clsx } from 'clsx'
import { useRenderGrid } from '@/hooks/useRenderGrid'
import { CANVAS_HEIGHT, CANVAS_WIDTH, MAX_ROWS_COLS } from '@/global/constants'

type DrawPanelProps = {
  gameMode: 'none' | 'paint' | 'rps' | 'snake',
  selectedColor: string
  onLoadingPixel?: (position: Array<[ number, number ]>) => void,

  cellSize: number,
  onCellClick?: (position: [ number, number ]) => void,
  coordinates: [ number | undefined, number | undefined ] | undefined
  onPanning?: (isPanning: boolean) => void
}

export default function DrawPanel(props: DrawPanelProps) {
  const {
    gameMode,
    selectedColor,

    coordinates,
    cellSize,
    onCellClick,
    onPanning,
  } = props

  //moving the canvas
  const [ panning, setPanning ] = React.useState<boolean>(false)

  // offset is a negative value
  const [ panOffsetX, setPanOffsetX ] = React.useState<number>(0)
  const [ panOffsetY, setPanOffsetY ] = React.useState<number>(0)

  const [ startPanX, setStartPanX ] = React.useState<number>(0)
  const [ startPanY, setStartPanY ] = React.useState<number>(0)

  const visibleAreaXStart = Math.max(0, Math.floor(-panOffsetX / cellSize))
  const visibleAreaYStart = Math.max(0, Math.floor(-panOffsetY / cellSize))
  const visibleAreaXEnd = Math.min(MAX_ROWS_COLS, Math.ceil((CANVAS_WIDTH - panOffsetX) / cellSize))
  const visibleAreaYEnd = Math.min(MAX_ROWS_COLS, Math.ceil((CANVAS_HEIGHT - panOffsetY) / cellSize))

  //render canvas grid
  const renderGrid = useRenderGrid()

  //canvas ref
  const gridCanvasRef = React.useRef<HTMLCanvasElement>()

  React.useEffect(() => {
    if (gridCanvasRef.current) {
      const ctx = gridCanvasRef.current.getContext('2d')
      if (!ctx) return

      console.info("coordinates", coordinates);

      renderGrid(ctx, {
        width: gridCanvasRef.current.width,
        height: gridCanvasRef.current.height,
        cellSize,
        coordinates,

        panOffsetX,
        panOffsetY,
        selectedColor,
        visibleAreaXStart,
        visibleAreaXEnd,
        visibleAreaYStart,
        visibleAreaYEnd,
      })
    }
  }, [ coordinates, panOffsetX, panOffsetY, cellSize, selectedColor ])

  function onClickCoordinates(clientX: number, clientY: number) {
    if (!gridCanvasRef.current) return

    switch (gameMode) {
      case 'paint': {
        const rect = gridCanvasRef.current.getBoundingClientRect()
        const x = Math.abs(panOffsetX) + clientX - rect.left  // pixel
        const y = Math.abs(panOffsetY) + clientY - rect.top  // pixel

        const gridX = Math.floor(x / cellSize)
        const gridY = Math.floor(y / cellSize)

        onCellClick?.([ gridX, gridY ])
        break
      }
      default: {
        console.error('unknown game mode', gameMode)
      }
    }
  }

  function mouseDown(clientX: number, clientY: number) {
    setPanning(true)
    setStartPanX(clientX - panOffsetX)
    setStartPanY(clientY - panOffsetY)
  }

  function mouseMove(clientX: number, clientY: number) {
    if (!panning) return
    setPanOffsetX(clientX - startPanX)
    setPanOffsetY(clientY - startPanY)
  }

  return (
    <React.Fragment>
      <div className={clsx([
        'mt-20 w-full h-[704px] ',
      ])}>
        <div id={'canvas-container'} className={clsx([
          ' h-full max-w-[1728px] overflow-hidden',
        ])}>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/*@ts-ignore*/}
          <canvas ref={gridCanvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  className={clsx([ 'cursor-pointer', { 'cursor-grab': panning } ])}
                  onClick={(event) => {
                    onClickCoordinates(event.clientX, event.clientY)
                  }}
                  onMouseDown={(event) => mouseDown(event.clientX, event.clientY)}
                  onMouseMove={(event) => mouseMove(event.clientX, event.clientY)}
                  onMouseUp={() => setPanning(false)}
                  onMouseLeave={() => setPanning(false)}
          />
        </div>
      </div>
    </React.Fragment>
  )
}
