import Pixel from '@/components/shared/Pixel.tsx'
import React from 'react'

export default function Row(){
  const pixels = []

  for(let x = 0; x < 500; x++){
    pixels.push(<Pixel key={x}/>)
  }
  return(
    <React.Fragment>
      <div className={'border border-red-700'}>
        {pixels}

      </div>
    </React.Fragment>
  )
}
