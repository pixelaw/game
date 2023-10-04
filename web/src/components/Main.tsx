import React from 'react'
import { useDojo } from '@/DojoContext'
import Plugin from '@/components/Plugin'
import { hexToRgb } from '@/global/utils'
import { CompactPicker } from 'react-color'
import { useAtom, useAtomValue } from 'jotai'
import { EXECUTION_STATUS, MAX_CELL_SIZE } from '@/global/constants'
import DrawPanel from '@/components/shared/DrawPanel'
import { usePaintCanvas } from '@/hooks/systems/usePaintCanvas'
import { colorAtom, gameModeAtom, zoomLevelAtom } from '@/global/states'
import { getEntityIdFromKeys } from '@dojoengine/utils'
import { getComponentValue } from '@latticexyz/recs'
import { useFilteredEntities } from '@/hooks/entities/useFilteredEntities.ts'

type Account = {
  address: string,
  active: boolean
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

  const hexColor = useAtomValue(colorAtom)
  const paintCanvas = usePaintCanvas()
  //mode of the game
  const gameMode = useAtomValue(gameModeAtom)
  //selected color in color pallete
  const [ selectedColor, setColor ] = useAtom(colorAtom)
  //For setting the color of the pixel, getting the x and y coordinates when clicking the pixel
  const [coordinates, setCoordinates] = React.useState<[number | undefined, number | undefined]>()
  const [ isPanning, setIsPanning ] = React.useState<boolean>(false)

  const [ visibleAreaStart, setVisibleAreaStart ] = React.useState<[ number, number ]>([ 0, 0 ])
  const [ visibleAreaEnd, setVisibleAreaEnd ] = React.useState<[ number, number ]>([ 28, 8 ])

  useFilteredEntities(
    visibleAreaStart[0],
    visibleAreaEnd[0],
    visibleAreaStart[1],
    visibleAreaEnd[1],
  )

  React.useEffect(() => {
    if (isDeploying) return
    if (isNaN(index)) return
    if (hasAccount) return
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

  return (
      <React.Fragment>
          {
              !isLoading ?
                  <>
                      <div className={'m-sm'}>
                        <DrawPanel
                          coordinates={coordinates}
                          cellSize={cellSize}
                          gameMode={gameMode}
                          selectedColor={selectedColor}
                          onPanning={(isPanning) => {
                            setIsPanning(isPanning)
                          }}
                          onVisibleAreaCoordinate={(visibleAreaStart, visibleAreaEnd) => {
                            if (isPanning) return
                            const timer = setTimeout(() => {
                              setVisibleAreaStart(visibleAreaStart) // replace with your value
                              setVisibleAreaEnd(visibleAreaEnd) // replace with your value
                            }, 3000)

                            return () => clearTimeout(timer)

                          }}
                          onVisisbleCoordinateChanged={visibleCoordinates => {
                            if (!isPanning) {
                              const entityIds = visibleCoordinates.map(visibleCoordinate => {
                                return getEntityIdFromKeys([ BigInt(visibleCoordinate[0]), BigInt(visibleCoordinate[1]) ])
                              })

                              const colors = entityIds.map(entityId => {
                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                return getComponentValue(Color, entityId)
                              })

                              console.info('colors', colors)
                            }
                          }}
                          onCellClick={(position) => {
                            setCoordinates([position[0], position[1]])
                            paintCanvas.mutateAsync({
                              position,
                              rgbColor: hexToRgb(hexColor) ?? [ 0, 0, 0 ],
                            })
                              .then((response) => {
                                if (response.execution_status === EXECUTION_STATUS.SUCCEEDED) {
                                  setCoordinates([undefined, undefined])
                                }
                              })
                              .catch(err => {
                                console.error(err)
                              })
                          }}
                        />

                          <div className="fixed bottom-5 right-20">
                            <CompactPicker color={selectedColor} onChangeComplete={(color) => setColor(color.hex)} />
                          </div>
                      </div>

                      <Plugin/>
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

export default Main;
