import { useCallback, useEffect, useRef, useState } from 'react'
import { StyledCanvas } from '../components/Canvas'
import { useCanvas } from '../components/CanvasHooks'
import { Level } from '../components/Level'

const Level6Canvas = () => {
  const { canvasRef, ctxRef } = useCanvas()
  useDrawLineOnClick(canvasRef, ctxRef)

  return <StyledCanvas ref={canvasRef} />
}

type Point = {
  x: number
  y: number
}

const drawLine = (ctx: CanvasRenderingContext2D, startPoint: Point, endPoint: Point) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.beginPath()
  ctx.setLineDash([5, 4])
  ctx.moveTo(startPoint.x, startPoint.y)
  ctx.lineTo(endPoint.x, endPoint.y)
  ctx.stroke()
  ctx.closePath()
}

// new function to draw a circle at the starting point of the line
// eslint-disable-next-line
const drawCircle = (ctx: CanvasRenderingContext2D, startPoint: Point, endPoint: Point) => {
  // TODO: implement and use this function
  // use the arc method: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc
}

// helper functions
// const getLineLength = (startPoint: Point, endPoint: Point) => {
//   return Math.sqrt(
//     Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2),
//   )
// }
//
// const getRadiusFromLength = (length: number) => Math.sqrt(length) * 3

const useDrawLineOnClick = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  ctxRef: React.RefObject<CanvasRenderingContext2D | null>,
) => {
  const [startPoint, setStartPoint] = useState<Point | null>(null)
  const [endPoint, setEndPoint] = useState<Point | null>(null)  
  
  const canvasCoordinatesRef = useRef<{ left: number; top: number }>({ left: 0, top: 0 })
  useEffect(() => {
    if (canvasRef.current) canvasCoordinatesRef.current = canvasRef.current.getBoundingClientRect()
  }, [canvasRef])

  useEffect(() => {
    if (!startPoint || !endPoint) {
      return
    }
    drawLine(ctxRef.current!, startPoint, endPoint)
  }, [startPoint, endPoint, ctxRef])

  const handleMouseDown = useCallback((event: MouseEvent) => {
    const { left, top } = canvasCoordinatesRef.current
    setStartPoint({ x: event.clientX - left, y: event.clientY - top })
  }, [])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const { left, top } = canvasCoordinatesRef.current
    setEndPoint({ x: event.clientX - left, y: event.clientY - top })
  }, [])

  const handleMouseUp = useCallback(() => {
    setStartPoint(null)
    setEndPoint(null)
    ctxRef.current?.clearRect(0, 0, ctxRef.current.canvas.width, ctxRef.current.canvas.height)
  }, [ctxRef])

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousemove', handleMouseMove)
  }, [handleMouseDown, handleMouseUp, handleMouseMove])
}

export const Level6 = () => (
  <Level level={6} title="Draw line and circle on click + drag">
    <Level6Canvas />
  </Level>
)
