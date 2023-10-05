import React, {memo} from 'react'
import {clsx} from 'clsx'
import {useRenderGrid} from '@/hooks/useRenderGrid'
import {CANVAS_HEIGHT, CANVAS_WIDTH, MAX_ROWS_COLS} from '@/global/constants'

export type Coordinate = [ number, number ]

type VisibleCoordinates = Coordinate[]

export type CellDatum = {
  coordinates: Array<number>
  hexColor: string
}

type DrawPanelProps = {
  gameMode: 'none' | 'paint' | 'rps' | 'snake',
  selectedColor: string
  onLoadingPixel?: (position: Array<[ number, number ]>) => void,

  data?: Array<CellDatum | undefined> | undefined,
  cellSize: number,
  onCellClick?: (position: [ number, number ]) => void,
  coordinates: [ number | undefined, number | undefined ] | undefined
  onVisisbleCoordinateChanged?: (visibleCoordinates: VisibleCoordinates) => void
  onOffsetChanged?: (offsetCoordinate: Coordinate) => void
  onVisibleAreaCoordinate?: (visibleAreaStart: Coordinate, visibleAreaEnd: Coordinate) => void
  isCanvasRender: boolean
}

const DrawPanel = memo((props: DrawPanelProps) => {
  const {
    gameMode,
    selectedColor,

    coordinates,
    cellSize,
    onCellClick,
    onVisibleAreaCoordinate,
    data,
  } = props

  //moving the canvas
  const [ panning, setPanning ] = React.useState<boolean>(false)

  // offset is a negative value
  const [ panOffsetX, setPanOffsetX ] = React.useState<number>(0)
  const [ panOffsetY, setPanOffsetY ] = React.useState<number>(0)

  const [ initialPositionX, setInitialPositionX ] = React.useState<number>(0)
  const [ initialPositionY, setInitialPositionY ] = React.useState<number>(0)

  // min: [x,y], [10,10]
  const visibleAreaXStart = Math.max(0, Math.floor(-panOffsetX / cellSize))
  const visibleAreaYStart = Math.max(0, Math.floor(-panOffsetY / cellSize))

  // max: [x,y]: [20,20]
  const visibleAreaXEnd = Math.min(MAX_ROWS_COLS, Math.ceil((CANVAS_WIDTH - panOffsetX) / cellSize))
  const visibleAreaYEnd = Math.min(MAX_ROWS_COLS, Math.ceil((CANVAS_HEIGHT - panOffsetY) / cellSize))

  // Add a new state for storing the mousedown time
  const [ mouseDownTime, setMouseDownTime ] = React.useState<number>(0)


  //render canvas grid
  const renderGrid = useRenderGrid()

  //canvas ref
  const gridCanvasRef = React.useRef<HTMLCanvasElement>()


  //It should be run one time only
  React.useEffect(() => {
    if (gameMode !== 'paint') return
    onVisibleAreaCoordinate?.([ visibleAreaXStart, visibleAreaYStart ], [ visibleAreaXEnd, visibleAreaYEnd ])
    // setOnRender(false)
  }, [])

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
        pixels: data,
      })
    }
  }, [ coordinates, panOffsetX, panOffsetY, cellSize, selectedColor, data ])

  function onClickCoordinates(clientX: number, clientY: number) {
    if (!gridCanvasRef.current) return

    switch (gameMode) {
      case 'paint': {
        const rect = gridCanvasRef.current.getBoundingClientRect()
        const x = Math.abs(panOffsetX) + clientX - rect.left  // pixel
        const y = Math.abs(panOffsetY) + clientY - rect.top  // pixel

        const gridX = Math.floor(x / cellSize)
        const gridY = Math.floor(y / cellSize)
        console.info("grid", gridX, gridY);

        onCellClick?.([ gridX, gridY ])
        break
      }
      default: {
        console.error('unknown game mode', gameMode)
      }
    }
  }

  function onMouseLeave() {
    setPanning(false)
    onVisibleAreaCoordinate?.([ visibleAreaXStart, visibleAreaYStart ], [ visibleAreaXEnd, visibleAreaYEnd ])
  }

  function onMouseUp(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    setPanning(false)
    onVisibleAreaCoordinate?.([ visibleAreaXStart, visibleAreaYStart ], [ visibleAreaXEnd, visibleAreaYEnd ])

    // If the time difference between mouse down and up is less than a threshold (e.g., 200ms), it's a click
    if (Date.now() - mouseDownTime < 300) {
      onClickCoordinates(event.clientX, event.clientY)
    }
  }

  function onMouseDown(clientX: number, clientY: number) {
    setPanning(true)
    setInitialPositionX(clientX - panOffsetX)
    setInitialPositionY(clientY - panOffsetY)

    // Record the current time when mouse is down
    setMouseDownTime(Date.now())
  }

  function onMouseMove(clientX: number, clientY: number) {
    if (!panning) return
    // this is a negative value
    const offsetX = clientX - initialPositionX;
    const offsetY = clientY - initialPositionY;

    const maxOffsetX = -(MAX_ROWS_COLS * cellSize - CANVAS_WIDTH) ; // Maximum allowed offset in X direction
    const maxOffsetY = -(MAX_ROWS_COLS * cellSize - CANVAS_WIDTH) ; // Maximum allowed offset in Y direction

    console.info([offsetX, offsetY], [maxOffsetX, maxOffsetY])

    setPanOffsetX(offsetX > 0 ? 0 : Math.abs(offsetX) > Math.abs(maxOffsetX) ? maxOffsetX : offsetX)
    setPanOffsetY(offsetY > 0 ? 0 : Math.abs(offsetY) > Math.abs(maxOffsetY) ? maxOffsetY : offsetY)
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
                  onMouseDown={(event) => onMouseDown(event.clientX, event.clientY)}
                  onMouseMove={(event) => onMouseMove(event.clientX, event.clientY)}
                  onMouseUp={(event) => onMouseUp(event)}
                  onMouseLeave={onMouseLeave}
          />
        </div>
      </div>
    </React.Fragment>
  )
}, (prevProps, nextProps) => {
  const conditionOne = prevProps.isCanvasRender === nextProps.isCanvasRender
  const condtionTwo = prevProps.coordinates === nextProps.coordinates
  const condtionThree = prevProps.cellSize === nextProps.cellSize
  const conditionFour = prevProps.selectedColor === nextProps.selectedColor
  const conditionFive = prevProps.data === nextProps.data

  return conditionOne &&
    condtionTwo &&
    condtionThree &&
    conditionFour &&
    conditionFive
})

export default DrawPanel
