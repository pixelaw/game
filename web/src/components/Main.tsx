import React from 'react'
import {useDojo} from '@/DojoContext'
import Plugin from '@/components/Plugin'
import {hexToRgb, rgbToHex} from '@/global/utils'
import {ColorResult, CompactPicker} from 'react-color'
import {useAtom, useAtomValue} from 'jotai'
import {EXECUTION_STATUS, MAX_CELL_SIZE} from '@/global/constants'
import DrawPanel, {Coordinate} from '@/components/shared/DrawPanel'
import {usePaintCanvas} from '@/hooks/systems/usePaintCanvas'
import {getEntityIdFromKeys} from '@dojoengine/utils'
import {getComponentValue} from '@latticexyz/recs'
import {useFilteredEntities} from '@/hooks/entities/useFilteredEntities.ts'
import {colorAtom, gameModeAtom, isCanvasRenderAtom, zoomLevelAtom} from '@/global/states'

const FilteredComponents: React.FC<{ xMin: number, xMax: number, yMin: number, yMax: number }> = ({xMin, xMax, yMin, yMax}) => {
  //it always rerender this query because of refetch interval
  useFilteredEntities(xMin, xMax, yMin, yMax)
  return <></>
}

type Account = {
  address: string,
  active: boolean
}

// Data = [0,0,256,256,256 ]
// const data: Record<`[${number},${number}]`, string> = {
//   "[0,0]":  '#fffff'
// }

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

  // const hexColor = useAtomValue(colorAtom)

  const paintCanvas = usePaintCanvas()
  //mode of the game
  const gameMode = useAtomValue(gameModeAtom)
  //selected color in color pallete
  const [ selectedHexColor, setColor ] = useAtom(colorAtom)
  //For setting the color of the pixel, getting the x and y coordinates when clicking the pixel
  const [coordinates, setCoordinates] = React.useState<[number, number] | undefined>()

  const [ visibleAreaStart, setVisibleAreaStart ] = React.useState<[ number, number ]>([ 0, 0 ])
  const [ visibleAreaEnd, setVisibleAreaEnd ] = React.useState<[ number, number ]>([ 28, 8 ])

  const [coordinatesToQuery, setCoordinatesToQuery] = React.useState<[number, number][]>([])

  //Check if the filter is on success on first load
  const [isCanvasRender] = useAtom(isCanvasRenderAtom)

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

  const queriedEntityIds = coordinatesToQuery.map(visibleCoordinate => {
    return getEntityIdFromKeys([ BigInt(visibleCoordinate[0]), BigInt(visibleCoordinate[1]) ])
  })

  const entityColors = queriedEntityIds.map(entityId => {
    return getComponentValue(Color, entityId)
  }).filter(data => data !== undefined)

  const [pixelData, setPixelData] = React.useState<Record<`[${number},${number}]`, string>>({})

  React.useEffect(() => {
    const entries = entityColors.map((color) => {
      if (!color) return
      const hexColor = rgbToHex(color.r, color.g, color.b)
      return [color.x, color.y, hexColor] as [number, number, string]
    })

    if (!entries) return

    setPixelData(prev => {
      const newData = {...prev}

      for (const entry of entries) {
        if (!entry) continue
        newData[`[${entry[0]},${entry[1]}]`] = entry[2]
      }

      return newData
    })
  }, [entityColors])

  //

  const handleVisibleAreaCoordinate = (visibleAreaStart: Coordinate, visibleAreaEnd: Coordinate) => {
    const expansionFactor = 10
    const minLimit = 0, maxLimit = 256
    const visibleCells = []

    const expandedMinX = visibleAreaStart[0] - expansionFactor
    const expandedMinY = visibleAreaStart[1] - expansionFactor

    const expandedMaxX = visibleAreaEnd[0] + expansionFactor
    const expandedMaxY = visibleAreaEnd[1] + expansionFactor


    visibleAreaStart[0] = expandedMinX < minLimit ? minLimit : expandedMinX;
    visibleAreaStart[1] = expandedMinX < minLimit ? minLimit : expandedMinY;

    visibleAreaEnd[0] = expandedMaxX > maxLimit ? maxLimit : expandedMaxX;
    visibleAreaEnd[1] = expandedMaxY > maxLimit ? maxLimit : expandedMaxY;


    for (let x = visibleAreaStart[0]; x <= visibleAreaEnd[0]; x++) {
      for (let y = visibleAreaStart[1]; y <= visibleAreaEnd[1]; y++) {
        const cell: [number, number] = [x, y]
        visibleCells.push(cell)
      }
    }

    setVisibleAreaStart(visibleAreaStart)
    setVisibleAreaEnd(visibleAreaEnd)

    setCoordinatesToQuery(visibleCells)
  }

  const handleCellClick = (position: Coordinate) => {
    setCoordinates([position[0], position[1]])
    setPixelData(prev => {
      const newData = {...prev}
      newData[`[${position[0]},${position[1]}]`] = selectedHexColor
      return newData
    })

    paintCanvas.mutateAsync({
      position,
      rgbColor: hexToRgb(selectedHexColor) ?? [0, 0, 0],
    })
      .then((response) => {
        if (response.execution_status === EXECUTION_STATUS.SUCCEEDED) {
          setCoordinates(undefined)

        }
      })
      .catch(err => {
        console.error('reversing color because of: ', err)
        setCoordinates(undefined)
      })
  }

  const handleColorChange = (color: ColorResult) => {
    setColor(color.hex)
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
                            data={Object.entries(pixelData).map(([key, value]) => {
                              return {
                                coordinates: key.match(/\d+/g)?.map(Number) as [number, number],
                                hexColor: value
                              }
                            })}
                            coordinates={coordinates}
                            cellSize={cellSize}
                            gameMode={gameMode}
                            selectedColor={selectedHexColor}
                            onVisibleAreaCoordinate={handleVisibleAreaCoordinate}
                            onCellClick={handleCellClick}
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

