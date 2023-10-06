// import {
//   rgbToHex,
// } from '@/global/utils'
// import { useAtom, useAtomValue } from 'jotai'
// import { colorAtom, coordinatesAtom, gameModeAtom, unicodeAtom, viewModeAtom } from '../global/states'
// import usePaint from "../hooks/systems/usePaint";
// import { useDojo } from '@/DojoContext'
// import { useComponentValue } from '@dojoengine/react'
// import { getEntityIdFromKeys } from '@dojoengine/utils'
// import { clsx } from 'clsx'

// interface PixelProps {
//     index: number;
//     position: number[];
// }

interface PixelProps {
    index: number;
    position: [number, number];
}


// const initialData = {
//   color: "#2F1643",
//   unicode: '0x10',
// };
//
// const Loading = () => {
//   return (
//     <svg className="animate-spin h-5 w-5 text-brand-blackAccent text-center" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//     </svg>
//   )
// }

export default function Pixel( { position}: PixelProps){

  return (
    <>{JSON.stringify(position)}</>
  )
  //   const {
  //     setup: {
  //       components: { Color, NeedsAttention, Owner },
  //     },
  //     account: { account }
  //   } = useDojo()
  //
  //   const keys = position.map(p => BigInt(p))
  //   const entityId = getEntityIdFromKeys(keys)
  //
  //   const color = useComponentValue(Color, entityId)
  //   // const text = useComponentValue(Text, entityId)
  //   const needsAttention = useComponentValue(NeedsAttention, entityId)
  //   const owner = useComponentValue(Owner, entityId)
  //
  //   const selectedColor = useAtomValue(colorAtom)
  //   const selectedUnicode = useAtomValue(unicodeAtom)
  //   const viewMode = useAtomValue(viewModeAtom)
  //   const gameMode = useAtomValue(gameModeAtom)
  //
  //   const [, setCoordinnate] = useAtom(coordinatesAtom)
  //
  //   const paint = usePaint(position as [number, number])
  //
  //   const hexColor = color ? rgbToHex(color.r, color.g, color.b) : undefined
  //
  //   const [pixelData, setPixelData] = useState(initialData);
  //
  // // the generateComponent.cjs makes the address into a number thereby causing this typing issue
  // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // // @ts-ignore
  // const isGlow = (owner?.address === account?.address) && !!needsAttention?.value
  //
  //
  //   React.useEffect(() => {
  //       if (!hexColor) {
  //           setPixelData(prevPixelData => {
  //               return {...prevPixelData, color: initialData.color}
  //           })
  //           return
  //       }
  //       setPixelData(prevPixelData => {
  //           return {...prevPixelData, color: hexColor}
  //       })
  //   }, [hexColor])
  //
  //   function executePaint() {
  //       paint.mutateAsync().catch((error) => {
  //         console.error("reversing color because of: ", error)
  //         // reverse coloring on error
  //         setPixelData({...pixelData, color: hexColor ?? initialData.color});
  //       })
  //   }
  //
  //   function handleClick() {
  //       switch (gameMode) {
  //           case "paint": {
  //               if (hexColor !== selectedColor) executePaint()
  //               break
  //           }
  //           case "rps": {
  //               // executeRps(position)
  //               break
  //           }
  //           case "snake": {
  //               // executeSnake(position)
  //               break
  //           }
  //           default: {
  //               console.info("unknown game mode:", gameMode)
  //           }
  //       }
  //
  //       // if (viewMode === "Pixel") {
  //       //     setPixelData({...pixelData, color: selectedColor});
  //       // } else if (viewMode === "Game") {
  //       //     setPixelData({...pixelData, unicode: selectedUnicode});
  //       // }
  //   }
  //
  //   return (
  //     <button
  //         onMouseOver={() => setCoordinnate({x: position[0], y: position[1]} )}
  //         disabled={gameMode === 'none'}
  //         style={{backgroundColor: pixelData.color, margin: '0rem', border: '0.5px solid #2E0A3E'}}
  //         className={
  //           clsx([
  //             'disabled:cursor-not-allowed text-white h-[64px] w-[64px] transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 flex justify-center items-center',
  //             { 'shadow-glow': isGlow }
  //           ])
  //         }
  //         onClick={() => {
  //           handleClick()
  //       }}
  //     >
  //       {paint.isLoading && <Loading />}
  //         {viewMode === "Game" && pixelData.color === "#999999" && (
  //           <span>{String.fromCodePoint(parseInt('1F40D', 16))}</span>
  //         )}
  //     </button>
  //   )
}
