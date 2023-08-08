import React from 'react';
import Pixel from './Pixel';

interface RowProps {
  y: number;
  width: number;
}

const Row: React.FC<RowProps> = ({ y, width}) => {
  const pixels = [];

  for (let x = 0; x < width; x++) {
    const index = y + x;
    pixels.push(<Pixel
      index={index}
      key={x}
      position={[x,y]}
    />)
  }

  return (
    <div className='flex justify-center'>
      {pixels}
    </div>
  )
};

export default Row;