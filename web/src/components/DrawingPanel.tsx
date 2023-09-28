import React from 'react'
import Row from './Row'
import useEntities from '@/hooks/entities/useEntities'

const WIDTH = 30
const HEIGHT = 13;

// TODO: handle this properly. for now put this in an empty
// component so that it doesn't rerender everything else
const FetchEntities = () => {
  useEntities()
  return <></>
}

const DrawingPanel:React.FC = () => {
  const rows = [];

  for (let y = 0; y < HEIGHT; y++) {
    rows.push(<Row y={y} width={WIDTH} key={y}/>)
  }

  return (
      <React.Fragment>
          <div id="pixels" >
            {rows}
          </div>
        <FetchEntities />
      </React.Fragment>
  )
};

export default DrawingPanel;
