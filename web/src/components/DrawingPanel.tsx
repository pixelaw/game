import React from 'react';
import Row from './Row';
import usePaintedPixels from "../hooks/entities/usePaintedPixels";

const WIDTH = 64;
const HEIGHT = 64;

const DrawingPanel:React.FC = () => {
  const rows = [];

  usePaintedPixels()

  for (let y = 0; y < HEIGHT; y++) {
    rows.push(<Row y={y} width={WIDTH} key={y}/>)
  }

  return (
    <div>
      <div id="pixels" className=''>
        {rows}
      </div>
    </div>
  )
};

export default DrawingPanel;