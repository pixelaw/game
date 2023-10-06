import React from 'react'
// import Row from './Row'
// import { useAtom } from 'jotai'
// import { coordinatesAtom } from '@/global/states.ts'
// import useEntities from '@/hooks/entities/useEntities.ts'



// const DrawingPanel:React.FC = () => {
//   const rows = [];
//
//   useEntities()
//
//   for (let y = 0; y < HEIGHT; y++) {
//     rows.push(<Row y={y} width={WIDTH} key={y}/>)
//   }
//
//   return (
//       <React.Fragment>
//           <div id="pixels" className={clsx(['w-[91vw] h-[80vh] overflow-auto'])}>
//             {rows}
//           </div>
//       </React.Fragment>
//   )
// };

// TODO: handle this properly. for now put this in an empty
// component so that it doesn't rerender everything else
// const FetchEntities = () => {
//   useEntities()
//   return <></>
// }

const DrawingPanel: React.FC = () => {
  return(
    <></>
  )
  // const [, setCoordinnate] = useAtom(coordinatesAtom)
  //
  // const divRef = React.useRef<HTMLDivElement>(null);
  // const [visiblePixels, setVisiblePixels] = React.useState<{first: [number, number], last: [number, number]}>({first: [0, 0], last: [0, 0]});
  // const pixelSize = 64; // replace with your pixel size
  // const totalPixels = 50;
  // console.info("visiblePixels", visiblePixels);
  //
  // React.useEffect(() => {
  //   if (divRef.current) {
  //     const divWidth = divRef.current.offsetWidth;
  //     const divHeight = divRef.current.offsetHeight;
  //     setVisiblePixels(prevState => ({
  //       ...prevState,
  //       last: [
  //         Math.floor(divWidth / pixelSize),
  //         Math.floor(divHeight / pixelSize)
  //       ]
  //     }));
  //   }
  // }, []);
  //
  // const handleScroll = () => {
  //   if (divRef.current) {
  //     const scrollTop = divRef.current.scrollTop;
  //     const scrollLeft = divRef.current.scrollLeft;
  //     setVisiblePixels({
  //       first: [
  //         Math.floor(scrollLeft / pixelSize),
  //         Math.floor(scrollTop / pixelSize)
  //       ],
  //       last: [
  //         Math.floor((scrollLeft + divRef.current.offsetWidth) / pixelSize),
  //         Math.floor((scrollTop + divRef.current.offsetHeight) / pixelSize)
  //       ]
  //     });
  //   }
  // }
  // const rows = [];
  // for (let y = 0; y < totalPixels; y++) {
  //   rows.push(<Row y={y} width={totalPixels} key={y} />);
  // }
  //
  // return (
  //   <React.Fragment>
  //     {/*<div*/}
  //     {/*  ref={divRef}*/}
  //     {/*  id="pixels"*/}
  //     {/*  className={clsx([ 'w-[91vw] h-[80vh] overflow-auto' ])}*/}
  //     {/*  onMouseLeave={() => setCoordinnate({ x: 0, y: 0 })}*/}
  //     {/*>*/}
  //     {/*      {rows}*/}
  //     {/*    </div>*/}
  //
  //     <div
  //
  //       ref={divRef}
  //       onScroll={handleScroll}
  //       onMouseLeave={() => setCoordinnate({ x: 0, y: 0 })}
  //       style={{ width: '91vw', height: '80vh', overflow: 'auto' }}
  //     >
  //       {rows}
  //     </div>
  //       {/*<FetchEntities />*/}
  //     </React.Fragment>
  // )
};

export default DrawingPanel;
