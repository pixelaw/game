import React from 'react'
import Row from './Row'
import usePaintedPixels from '../hooks/entities/usePaintedPixels'

const WIDTH = 30
const HEIGHT = 13;

const DrawingPanel:React.FC = () => {
  const rows = [];

  usePaintedPixels()

  for (let y = 0; y < HEIGHT; y++) {
    rows.push(<Row y={y} width={WIDTH} key={y}/>)
  }

  return (
      <React.Fragment>
          <div id="pixels" >
            {rows}
          </div>
      </React.Fragment>
  )
};

export default DrawingPanel;
