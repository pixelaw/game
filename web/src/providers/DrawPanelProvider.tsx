import React, {SetStateAction} from 'react'
import {CellDatum, Coordinate, NeedsAttentionDatum} from '@/components/shared/DrawPanel.tsx'
import {useDojo} from '@/DojoContext.tsx'
import {useAtom, useAtomValue} from 'jotai'
import {
  colorAtom,
  gameModeAtom,
  notificationDataAtom,
  positionWithAddressAndTypeAtom,
  zoomLevelAtom,
} from '@/global/states.ts'
import {CANVAS_HEIGHT, CANVAS_WIDTH, MAX_CELL_SIZE, MAX_ROWS_COLS} from '@/global/constants.ts'
import {useEntityQuery} from '@dojoengine/react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {getComponentValue, getComponentValueStrict, Has, HasValue} from '@latticexyz/recs'
import { argbToHex, felt252ToString } from '@/global/utils.ts'
import useInteract from '@/hooks/systems/useInteract'
import ParamPicker from '@/components/ParamPicker'

type DrawPanelType = {
  gameMode: 'none' | 'paint' | 'rps' | 'snake',
  cellSize: number,
  selectedHexColor: string
  coordinates: [ number | undefined, number | undefined ] | undefined
  visibleAreaStart: [ number, number ]
  visibleAreaEnd: [ number, number ]
  panOffsetX: number
  panOffsetY: number
  setPanOffsetX: React.Dispatch<SetStateAction<number>>
  setPanOffsetY: React.Dispatch<SetStateAction<number>>
  data?: Array<CellDatum | undefined> | undefined,
  needsAttentionData?: Array<NeedsAttentionDatum | undefined> | undefined,

  onCellClick?: (position: [ number, number ]) => void,
  onVisibleAreaCoordinate?: (visibleAreaStart: Coordinate, visibleAreaEnd: Coordinate) => void
  onHover?: (coordinate: Coordinate) => void
}

export const DrawPanelContext = React.createContext<DrawPanelType>({} as DrawPanelType)

export default function DrawPanelProvider({ children }: { children: React.ReactNode }) {
  const {
    account: {
      account,
    },
    setup: {
      components: {
        Pixel,
        Alert
      },
    },
  } = useDojo()


  //mode of the game
  const gameMode = useAtomValue(gameModeAtom)
  //cell size or pixel size
  const zoomLevel = useAtomValue(zoomLevelAtom)
  const cellSize = MAX_CELL_SIZE * (zoomLevel / 100)

  //selected color in color pallete
  const [ selectedHexColor,  ] = useAtom(colorAtom)

  //For setting the color of the pixel, getting the x and y coordinates when clicking the pixel
  const [ coordinates, setCoordinates ] = React.useState<[ number, number ] | undefined>()

  // offset is a negative value
  const [ panOffsetX, setPanOffsetX ] = React.useState<number>(0)
  const [ panOffsetY, setPanOffsetY ] = React.useState<number>(0)

  //For setting the visible area
  const [ visibleAreaStart, setVisibleAreaStart ] = React.useState<[ number, number ]>([ 0, 0 ])
  const [ visibleAreaEnd, setVisibleAreaEnd ] = React.useState<[ number, number ]>([ 28, 8 ])

  //setting the coordinates and passing it to plugin when hover in the cell
  const [position, setPositionWithAddressAndType] = useAtom(positionWithAddressAndTypeAtom)

  const { interact, params } = useInteract(
    `${gameMode}_actions`,
    selectedHexColor,
    {
      x: position?.x ?? 0,
      y: position?.y ?? 0
    }
  )

  const hasParams = !!params.length

  const [additionalParams, setAdditionalParams] = React.useState<Record<string,any>>({})

  React.useEffect(() => {
    setAdditionalParams({})
  }, [gameMode])


  //For instant coloring the pixel
  const [ tempData, setTempData ] = React.useState<Record<`[${number},${number}]`, { color: string, text: string}>>({})

  //for notification
  const [ notificationData, ] = useAtom(notificationDataAtom)

  const pixelData: Record<`[${number},${number}]`, { color: string, text: string}> = {}
  const needAttentionData: Record<`[${number},${number}]`, boolean | undefined> = {}

  const entityIds = useEntityQuery([ Has(Pixel) ])
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const notifEntitiyIds = useEntityQuery([ HasValue(Alert, { alert: true }), HasValue(Pixel, { owner: account.address }) ])


  const pixels = entityIds
    .map(entityId => getComponentValue(Pixel, entityId))
    .filter(entity => !!entity)


  pixels.forEach(pixel => {
      pixelData[`[${pixel!.x},${pixel!.y}]`] = {
        color: argbToHex(pixel!.color),
        text: pixel?.text?.toString() ?? ''
      }
  })

  const entityNeedsAttentions = notifEntitiyIds
    .map(entityId => {
      return getComponentValueStrict(Alert, entityId)
    })

  entityNeedsAttentions.forEach(entityNeedsAttention => {
    needAttentionData[`[${entityNeedsAttention.x},${entityNeedsAttention.y}]`] = !!entityNeedsAttention.alert
  })

  const handleData = () => {
    const data = {
      ...tempData,
      ...pixelData,
    }
    return Object.entries(data).map(([ key, value ]) => {
      return {
        coordinates: key.match(/\d+/g)?.map(Number) as [ number, number ],
        hexColor: value.color,
        text: value.text
      }
    })
  }

  const handleNeedsAttentionData = () => {
    return Object.entries(needAttentionData).map(([ key, value ]) => {
      return {
        coordinates: key.match(/\d+/g)?.map(Number) as [ number, number ],
        value: value,
      }
    })
  }

  const updatePixelData = (position: Coordinate, color: string) => {
    const newData = { ...pixelData }

    newData[`[${position[0]},${position[1]}]`] = {
      text: pixelData[`[${position[0]},${position[1]}]`]?.text ?? '',
      color,

    }

    setTempData(prev => {
      return {
        ...prev,
        [`[${position[0]},${position[1]}]`]: color,
      }
    })
  }

  const handleCellClick = (position: Coordinate) => {
    setCoordinates([ position[0], position[1] ])

    updatePixelData(position, selectedHexColor)

    const variables = hasParams ? {
      otherParams: additionalParams
    } : {}

    interact.mutateAsync(variables)
      .then(() => {
        setCoordinates(undefined)
      })
      .catch(err => {
        console.error('reversing color because of: ', err)
        setTempData({})
        setCoordinates(undefined)
      })
  }

  const handleVisibleAreaCoordinate = (visibleAreaStart: Coordinate, visibleAreaEnd: Coordinate) => {
    const expansionFactor = 10
    const minLimit = 0, maxLimit = 256

    const expandedMinX = visibleAreaStart[0] - expansionFactor
    const expandedMinY = visibleAreaStart[1] - expansionFactor

    const expandedMaxX = visibleAreaEnd[0] + expansionFactor
    const expandedMaxY = visibleAreaEnd[1] + expansionFactor


    visibleAreaStart[0] = expandedMinX < minLimit ? minLimit : expandedMinX
    visibleAreaStart[1] = expandedMinX < minLimit ? minLimit : expandedMinY

    visibleAreaEnd[0] = expandedMaxX > maxLimit ? maxLimit : expandedMaxX
    visibleAreaEnd[1] = expandedMaxY > maxLimit ? maxLimit : expandedMaxY

    setVisibleAreaStart(visibleAreaStart)
    setVisibleAreaEnd(visibleAreaEnd)
  }

  const handleHover = (coordinate: Coordinate) => {
    setPositionWithAddressAndType(() => {
      const pixel = pixels.find(pixel => pixel!.x === coordinate[0] && pixel!.y == coordinate[1])
      return {
        x: coordinate[0],
        y: coordinate[1],
        address: pixel ? pixel.owner : 'N/A',
        pixel: pixel ? felt252ToString(pixel.app) : 'N/A'
      }
    })
  }

  React.useEffect(() => {
    if (!notificationData || !notificationData.x || !notificationData.y) return
    const targetPixelX = notificationData.x * cellSize
    const targetPixelY = notificationData.y * cellSize

    const offsetX = targetPixelX - CANVAS_WIDTH / 2
    const offsetY = targetPixelY - CANVAS_HEIGHT / 2

    const maxOffsetX = -(MAX_ROWS_COLS * cellSize - CANVAS_WIDTH)
    const maxOffsetY = -(MAX_ROWS_COLS * cellSize - CANVAS_HEIGHT)

    setPanOffsetX(offsetX < 0 ? 0 : Math.abs(offsetX) > Math.abs(maxOffsetX) ? maxOffsetX : -offsetX)
    setPanOffsetY(offsetY < 0 ? 0 : Math.abs(offsetY) > Math.abs(maxOffsetY) ? maxOffsetY : -offsetY)

  }, [cellSize, notificationData])

  return (
    <DrawPanelContext.Provider value={{
      gameMode,
      cellSize,
      selectedHexColor,
      coordinates,
      visibleAreaStart,
      visibleAreaEnd,
      panOffsetX,
      panOffsetY,
      setPanOffsetX,
      setPanOffsetY,
      data: handleData(),
      needsAttentionData: handleNeedsAttentionData(),
      onCellClick: handleCellClick,
      onVisibleAreaCoordinate: handleVisibleAreaCoordinate,
      onHover: handleHover,
    }}>
      {children}
      {hasParams && <ParamPicker value={additionalParams} onChange={(newValue) => setAdditionalParams(newValue)} params={params} />}
    </DrawPanelContext.Provider>
  )
}

export function useDrawPanel() {
  return React.useContext(DrawPanelContext)
}
