import React from 'react'
import { useDojo } from '@/DojoContext'
import Plugin from '@/components/Plugin'
import { felt252ToString, hexToRgb, rgbToHex } from '@/global/utils'
import { ColorResult, CompactPicker } from 'react-color'
import { useAtom, useAtomValue } from 'jotai'
import { EXECUTION_STATUS, MAX_CELL_SIZE } from '@/global/constants'
import DrawPanel, { Coordinate } from '@/components/shared/DrawPanel'
import { usePaintCanvas } from '@/hooks/systems/usePaintCanvas'
import { getComponentValue, getComponentValueStrict, Has, HasValue } from '@latticexyz/recs'
import { useFilteredEntities } from '@/hooks/entities/useFilteredEntities'
import {
  colorAtom,
  gameModeAtom,
  isCanvasRenderAtom,
  positionWithAddressAndTypeAtom,
  zoomLevelAtom,
} from '@/global/states'
import { useEntityQuery } from '@dojoengine/react'
import { Account, PositionWithAddressAndType } from '@/global/types'
import { useNeedsAttention } from '@/hooks/entities/useNeedsAttention'

const FilteredComponents: React.FC<{ xMin: number, xMax: number, yMin: number, yMax: number }> = ({xMin, xMax, yMin, yMax}) => {
  //it always rerender this query because of refetch interval to set the value of component in dojo
  useFilteredEntities(xMin, xMax, yMin, yMax)
  useNeedsAttention()
  return <></>
}

const Main = () => {
  const {
    account: {
      create,
      list,
      select,
      isDeploying,
      account
    },
    setup: {
      components: {
        Color,
        Owner,
        PixelType,
        NeedsAttention,
      },
    },
  } = useDojo()
  //return list of accounts ({address: '0x00...', active: boolean})[]
  const accounts = list()

  const urlParams = new URLSearchParams(window.location.search)
  const accountParam = urlParams.get('account')

  const accountParamInt = parseInt(accountParam ?? '1')
  const index = isNaN(accountParamInt) ? 1 : accountParamInt

  const selectedAccount = accounts[index - 1] as Account | undefined
  const hasAccount = !!selectedAccount
  const isAlreadySelected = account.address === selectedAccount?.address

  const [ isLoading, setIsLoading ] = React.useState(true)

  //===States for drawing panel===
  const zoomLevel = useAtomValue(zoomLevelAtom)
  //cell size or pixel size
  const cellSize = MAX_CELL_SIZE * (zoomLevel / 100)

  const paintCanvas = usePaintCanvas()
  //mode of the game
  const gameMode = useAtomValue(gameModeAtom)
  //selected color in color pallete
  const [ selectedHexColor, setColor ] = useAtom(colorAtom)
  //For setting the color of the pixel, getting the x and y coordinates when clicking the pixel
  const [coordinates, setCoordinates] = React.useState<[number, number] | undefined>()

  const [ visibleAreaStart, setVisibleAreaStart ] = React.useState<[ number, number ]>([ 0, 0 ])
  const [ visibleAreaEnd, setVisibleAreaEnd ] = React.useState<[ number, number ]>([ 28, 8 ])

  //Check if the filter is on success on first load
  const [isCanvasRender] = useAtom(isCanvasRenderAtom)

  //setting the coordinates and passing it to plugin when hover in the cell
  const [ , setPositionWithAddressAndType ] = useAtom(positionWithAddressAndTypeAtom)

  const [ tempData, setTempData ] = React.useState<Record<`[${number},${number}]`, string>>({})

  React.useEffect(() => {
    if (isDeploying || isNaN(index) || hasAccount) return
    create()
  }, [setIsLoading, hasAccount, index, isDeploying, create])

  React.useEffect(() => {
    if (isAlreadySelected) {
      setIsLoading(false)
      return
    }

    if (!hasAccount) return

    select(selectedAccount?.address ?? '')
  }, [setIsLoading, isAlreadySelected, selectedAccount?.address, select, hasAccount])

  const entityIds = useEntityQuery([ Has(Color) ])

  const entityColors: [ number, number, string ][] = entityIds
    .map(entityId => {
      const componentValue = getComponentValue(Color, entityId)
      const hexColor = rgbToHex(componentValue?.r ?? 0, componentValue?.g ?? 0, componentValue?.b ?? 0)
      return [ componentValue?.x ?? 0, componentValue?.y ?? 0, hexColor ]
    })

  const pixelData: Record<`[${number},${number}]`, string> = {}

  entityColors.forEach(entityColor => {
    pixelData[`[${entityColor[0]},${entityColor[1]}]`] = entityColor[2]
  })

  const entityOwners = entityIds
    .map(entityId => {
      return getComponentValue(Owner, entityId)
    })

  const entityPixelsType = entityIds
    .map(entityId => {
      return getComponentValue(PixelType, entityId)
    })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const notifEntitiyIds = useEntityQuery([ HasValue(NeedsAttention, { value: true }), HasValue(Owner, { address: account.address }) ])

  const needAttentionData: Record<`[${number},${number}]`, boolean | undefined> = {}

  const entityNeedsAttentions = notifEntitiyIds
    .map(entityId => {
      return getComponentValueStrict(NeedsAttention, entityId)
    })

  entityNeedsAttentions.forEach(entityNeedsAttention => {
    needAttentionData[`[${entityNeedsAttention.x},${entityNeedsAttention.y}]`] = entityNeedsAttention.value
  })

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

  const updatePixelData = (position: Coordinate, color: string) => {
    const newData = { ...pixelData }

    newData[`[${position[0]},${position[1]}]`] = color

    setTempData(prev => {
      return {
        ...prev,
        [`[${position[0]},${position[1]}]`]: color,
      }
    })
  }

  const handleCellClick = (position: Coordinate) => {
    // setCoordinates([position[0], position[1]])
    //
    // updatePixelData(position, selectedHexColor)
    //
    // paintCanvas.mutateAsync({
    //   position,
    //   rgbColor: hexToRgb(selectedHexColor) ?? [0, 0, 0],
    // })
    //   .then((response) => {
    //     if (response.execution_status === EXECUTION_STATUS.SUCCEEDED) {
    //       setCoordinates(undefined)
    //     }
    //   })
    //   .catch(err => {
    //     console.error('reversing color because of: ', err)
    //     setCoordinates(undefined)
    //   })
  }

  const handleColorChange = (color: ColorResult) => {
    setColor(color.hex)
  }

  const handleData = () => {
    const data = {
      ...tempData,
      ...pixelData,
    }
    return Object.entries(data).map(([ key, value ]) => {
      return {
        coordinates: key.match(/\d+/g)?.map(Number) as [ number, number ],
        hexColor: value,
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

  const handleHover = (coordinate: Coordinate) => {
    let hasOwner = false
    const newState: PositionWithAddressAndType = { x: coordinate[0], y: coordinate[1] }

    entityPixelsType.forEach((entityPixelType) => {
      if (entityPixelType && coordinate[0] === entityPixelType.x && coordinate[1] === entityPixelType.y) {
        newState.pixel = felt252ToString(entityPixelType.name)
        hasOwner = true
      }
    })

    entityOwners.forEach((entityOwner) => {
      if (entityOwner && coordinate[0] === entityOwner.x && coordinate[1] === entityOwner.y) {
        newState.address = entityOwner.address
        hasOwner = true
      }
    })

    if (!hasOwner) {
      newState.address = 'N/A'
      newState.pixel = 'N/A'
    }

    setPositionWithAddressAndType(newState)
  }

  return (
      <React.Fragment>
          {
              !isLoading ?
                  <>
                      <div className={'m-sm'}>
                        <>
                          <DrawPanel
                            isCanvasRender={isCanvasRender}
                            data={handleData()}
                            handleNeedsAttentionData={handleNeedsAttentionData()}
                            coordinates={coordinates}
                            cellSize={cellSize}
                            gameMode={gameMode}
                            selectedColor={selectedHexColor}
                            onVisibleAreaCoordinate={handleVisibleAreaCoordinate}
                            onCellClick={handleCellClick}
                            onHover={handleHover}
                          />
                        </>

                          <div className="fixed bottom-5 right-20">
                            <CompactPicker color={selectedHexColor} onChangeComplete={handleColorChange}/>
                          </div>
                      </div>

                      <Plugin/>

                    <FilteredComponents xMin={visibleAreaStart[0]} xMax={visibleAreaEnd[0]} yMin={visibleAreaStart[1]}
                                        yMax={visibleAreaEnd[1]}/>

                  </>
                  :
                  <div className={'fixed top-0 bottom-0 left-0 w-full bg-brand-body z-40 flex-center'}>
                      <div
                          className={'w-16 h-16 border-t-2 border-brand-violetAccent border-solid rounded-full animate-spin'}/>
                      <h2 className={'text-lg uppercase font-silkscreen text-brand-violetAccent ml-xs'}>Loading...</h2>
                  </div>
          }
      </React.Fragment>
  )
};

export default Main
