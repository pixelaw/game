import { useCallback } from 'react'

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
    } = options

    ctx.clearRect(0, 0, width, height)

    for (let r = visibleAreaXStart; r <= visibleAreaXEnd; r++) {
      for (let c = visibleAreaYStart; c <= visibleAreaYEnd; c++) {
        const x = r * cellSize + panOffsetX
        const y = c * cellSize + panOffsetY

        ctx.fillStyle = (coordinates && r === coordinates[0] && coordinates && c === coordinates[1]) ? selectedColor : '#2F1643'
        ctx.fillRect(x, y, cellSize, cellSize)
        ctx.strokeStyle = '#2E0A3E'

        ctx.strokeRect(x, y, cellSize, cellSize)

        ctx.fillStyle = '#FFFFFF'
        ctx.textAlign = 'center'
        ctx.fillText(`(${r}, ${c})`, x + cellSize / 2, y + cellSize / 2)
      }
    }
  }, [])
}
