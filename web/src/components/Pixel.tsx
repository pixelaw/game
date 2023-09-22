import React, {useState} from "react";

import {
  rgbToHex,
} from '../global/utils'
import {useAtomValue} from "jotai";
import {colorAtom, gameModeAtom, unicodeAtom, viewModeAtom} from "../global/states";
import usePaint from "../hooks/systems/usePaint";
import { useDojo } from '@/DojoContext'
import { useComponentValue } from '@dojoengine/react'
import { getEntityIdFromKeys } from '@dojoengine/utils'

interface PixelProps {
    index: number;
    position: number[];
}

const initialData = {
  color: "#2F1643",
  unicode: '0x10',
};

export default function Pixel( {position}: PixelProps){

    const {
      setup: {
        components: { Color },
      }
    } = useDojo()

    const keys = position.map(p => BigInt(p))
    const entityId = getEntityIdFromKeys(keys)

    const color = useComponentValue(Color, entityId)
    // const text = useComponentValue(Text, entityId)

    const selectedColor = useAtomValue(colorAtom)
    const selectedUnicode = useAtomValue(unicodeAtom)
    const viewMode = useAtomValue(viewModeAtom)
    const gameMode = useAtomValue(gameModeAtom)

    const paint = usePaint(position as [number, number])

    const hexColor = color ? rgbToHex(color.r, color.g, color.b) : undefined

    const [pixelData, setPixelData] = useState(initialData);

    React.useEffect(() => {
        if (!hexColor) {
            setPixelData(prevPixelData => {
                return {...prevPixelData, color: initialData.color}
            })
            return
        }
        setPixelData(prevPixelData => {
            return {...prevPixelData, color: hexColor}
        })
    }, [hexColor])

    function executePaint() {
        paint.mutateAsync()
          .catch(() => {
              console.error("reversing color")
              // reverse coloring on error
              setPixelData({...pixelData, color: initialData.color});
          })
    }

    function handleClick() {
        switch (gameMode) {
            case "paint": {
                executePaint()
                break
            }
            case "rps": {
                // executeRps(position)
                break
            }
            case "snake": {
                // executeSnake(position)
                break
            }
            default: {
                console.info("unknown game mode:", gameMode)
            }
        }

        if (viewMode === "Pixel") {
            setPixelData({...pixelData, color: selectedColor});
        } else if (viewMode === "Game") {
            setPixelData({...pixelData, unicode: selectedUnicode});
        }
    }

    return (
      <button
          disabled={gameMode === 'none'}
          style={{backgroundColor: pixelData.color, margin: '0rem', border: '0.5px solid #2E0A3E'}}
          className='disabled:cursor-not-allowed text-white h-[64px] w-[64px] transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110'
          onClick={() => {
            handleClick()
        }}
      >
          {viewMode === "Game" && pixelData.color === "#999999" && (
            <span>{String.fromCodePoint(parseInt('1F40D', 16))}</span>
          )}
      </button>
    )
}
