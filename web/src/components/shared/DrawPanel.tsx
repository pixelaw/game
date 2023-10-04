import React from 'react'
import { clsx } from 'clsx'
import { useRenderGrid } from '@/hooks/useRenderGrid'
import { CANVAS_HEIGHT, CANVAS_WIDTH, MAX_ROWS_COLS } from '@/global/constants'

type Coordinate = [ number, number ]

type VisibleCoordinates = Coordinate[]

type DrawPanelProps = {
  gameMode: 'none' | 'paint' | 'rps' | 'snake',
  selectedColor: string
  onLoadingPixel?: (position: Array<[ number, number ]>) => void,

  cellSize: number,
  onCellClick?: (position: [ number, number ]) => void,
  coordinates: [ number | undefined, number | undefined ] | undefined
  onPanning?: (isPanning: boolean) => void
  onVisisbleCoordinateChanged?: (visibleCoordinates: VisibleCoordinates) => void
  onOffsetChanged?: (offsetCoordinate: Coordinate) => void
  onVisibleAreaCoordinate?: (visibleAreaStart: Coordinate, visibleAreaEnd: Coordinate) => void
}

export default function DrawPanel(props: DrawPanelProps) {
  const {
    gameMode,
    selectedColor,

    coordinates,
    cellSize,
    onCellClick,
    onPanning,
    onVisisbleCoordinateChanged,
    onOffsetChanged,
    onVisibleAreaCoordinate,
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

  onVisibleAreaCoordinate?.([visibleAreaXStart, visibleAreaYStart], [visibleAreaXEnd, visibleAreaYEnd])

  const visibleCells: VisibleCoordinates = []
  //visible cells
  for (let x = visibleAreaXStart; x <= visibleAreaXEnd; x++) {
    for (let y = visibleAreaYStart; y <= visibleAreaYEnd; y++) {
      const cell: [ number, number ] = [ x, y ]
      visibleCells.push(cell)
    }
  }

  onVisisbleCoordinateChanged?.(visibleCells)

  //render canvas grid
  const renderGrid = useRenderGrid()

  //canvas ref
  const gridCanvasRef = React.useRef<HTMLCanvasElement>()

  React.useEffect(() => {
    if (gridCanvasRef.current) {
      const ctx = gridCanvasRef.current.getContext('2d')
      if (!ctx) return

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

  function onMouseDown(clientX: number, clientY: number) {
    setPanning(true)
    onPanning?.(true)
    setStartPanX(clientX - panOffsetX)
    setStartPanY(clientY - panOffsetY)
  }

  function onMouseMove(clientX: number, clientY: number) {
    if (!panning) return
    onOffsetChanged?.([ clientX - startPanX, clientY - startPanY ])
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
                  onMouseDown={(event) => onMouseDown(event.clientX, event.clientY)}
                  onMouseMove={(event) => onMouseMove(event.clientX, event.clientY)}
                  onMouseUp={() => {
                    onPanning?.(false)
                    setPanning(false)
                  }}
                  onMouseLeave={() => {
                    onPanning?.(false)
                    setPanning(false)
                  }}
          />
        </div>
      </div>
    </React.Fragment>
  )
}
