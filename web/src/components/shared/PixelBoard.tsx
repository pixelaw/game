import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';

const PixelBoard = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  let scale = 1;

  useImperativeHandle(ref, () => ({
    zoomIn() {
      scale *= 1.1;
      draw();
    },
    zoomOut() {
      scale /= 1.1;
      draw();
    }
  }));

  const draw = () => {
    if(canvasRef.current){
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.save();
      ctx.scale(scale, scale);

      // Draw grid
      for (let x = 0; x <= 256; x++) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 256);
      }

      for (let y = 0; y <= 256; y++) {
        ctx.moveTo(0, y);
        ctx.lineTo(256, y);
      }

      ctx.strokeStyle = "#ddd"; // Grid line color
      ctx.stroke();

      ctx.restore();
    }
  };

  useEffect(() => {
    draw();
  }, []);

  return (
    <canvas ref={canvasRef} width="256" height="256"></canvas>
  );
});

export default PixelBoard;
