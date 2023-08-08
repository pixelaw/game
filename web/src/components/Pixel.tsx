import React, {useState} from "react";

import {rgbToHex} from "../global/utils";
import {PixelEntity} from "../global/types";
import {useAtomValue} from "jotai";
import {colorAtom, gameModeAtom, unicodeAtom, viewModeAtom} from "../global/states";
import usePaint from "../hooks/systems/usePaint";
import {useQueryClient} from "@tanstack/react-query";
import {QUERY_KEY} from "../hooks/entities/usePaintedPixels";

interface PixelProps {
    index: number;
    position: number[];
}

export default function Pixel( {index, position}: PixelProps){

    const selectedColor = useAtomValue(colorAtom)
    const selectedUnicode = useAtomValue(unicodeAtom)
    const viewMode = useAtomValue(viewModeAtom)
    const gameMode = useAtomValue(gameModeAtom)

    const paint = usePaint(position as [number, number])

    const initialData = {
        color: index % 2 === 0 ? "#FFFFFF" : "#EBEBED",
        unicode: '0x10',
    };

    const queryClient = useQueryClient()

    const paintedPixels = queryClient.getQueryData<PixelEntity[]>(QUERY_KEY)

    const pixel: PixelEntity | undefined  =
      (paintedPixels?.find(pixel => pixel?.position?.x === position[0] && pixel?.position?.y === position[1]))
    const pixelColor = pixel?.color
    const hexColor = pixelColor ? rgbToHex(pixelColor.r, pixelColor.g, pixelColor.b) : undefined

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
    }, [hexColor, initialData.color])

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
      <div
        style={{backgroundColor: pixelData.color, margin: '0rem'}}
        className='flex items-center justify-center text-white h-4 w-4 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110'
        onClick={() => {
            handleClick()
        }}
      >
          {viewMode === "Game" && pixelData.color === "#999999" && (
            <span>{String.fromCodePoint(parseInt('1F40D', 16))}</span>
          )}
      </div>
    )
}
