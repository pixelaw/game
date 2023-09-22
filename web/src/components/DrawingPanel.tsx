import React from 'react'
import Row from './Row'
import useEntities from '@/hooks/entities/useEntities'

const WIDTH = 30
const HEIGHT = 13;

const DrawingPanel:React.FC = () => {
  const rows = [];

  useEntities()

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
