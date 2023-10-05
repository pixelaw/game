import { useCallback } from 'react'
import { CellDatum } from '@/components/shared/DrawPanel.tsx'

export function useRenderGrid() {
  return useCallback((ctx: CanvasRenderingContext2D, options: {
    width: number,
    height: number,
    cellSize: number,
    coordinates: [ number | undefined, number | undefined ] | undefined
    panOffsetX: number,
    panOffsetY: number,
    selectedColor: string,
    visibleAreaXStart: number,
    visibleAreaXEnd: number,
    visibleAreaYStart: number,
    visibleAreaYEnd: number,
    pixels: Array<CellDatum | undefined> | undefined,
  }) => {
    const {
      cellSize,
      width,
      height,
      panOffsetX,
      panOffsetY,
      coordinates,
      selectedColor,
      visibleAreaXStart,
      visibleAreaXEnd,
      visibleAreaYStart,
      visibleAreaYEnd,
      pixels,
    } = options
    ctx.clearRect(0, 0, width, height)

    for (let row = visibleAreaXStart; row <= visibleAreaXEnd; row++) {
      for (let col = visibleAreaYStart; col <= visibleAreaYEnd; col++) {
        const x = row * cellSize + panOffsetX
        const y = col * cellSize + panOffsetY

        let pixelColor = '#2F1643' // default color

        if (pixels && pixels.length > 0) {
          const pixel = pixels.find(p => p && p.coordinates[0] === row && p.coordinates[1] === col)
          if (pixel) {
            // Get the current color of the pixel
            const imageData = ctx.getImageData(x, y, 1, 1).data
            const currentColor = '#' + ((1 << 24) | (imageData[0] << 16) | (imageData[1] << 8) | imageData[2]).toString(16).slice(1)

            // Check if the pixel color has changed
            if (pixel.hexColor !== currentColor) {
              pixelColor = pixel.hexColor
            } else {
              // Skip this iteration if the pixel color hasn't changed
              continue
            }
          }
        }

        if (coordinates && row === coordinates[0] && col === coordinates[1]) {
          pixelColor = selectedColor
        }

        ctx.fillStyle = pixelColor
        ctx.fillRect(x, y, cellSize, cellSize)
        ctx.strokeStyle = '#2E0A3E'
        ctx.strokeRect(x, y, cellSize, cellSize)

        // ctx.fillStyle = '#FFFFFF'
        // ctx.textAlign = 'center'
        // ctx.fillText(`(${r}, ${c})`, x + cellSize / 2, y + cellSize / 2)
      }
    }
  }, [])
}
