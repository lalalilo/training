import { useCallback, useEffect, useRef, useState } from 'react'
import { StyledCanvas } from '../components/Canvas'
import { useCanvas } from '../components/CanvasHooks'
import { Level } from '../components/Level'

const Level5Canvas = () => {
  const { canvasRef, ctxRef } = useCanvas()
  useDrawLineOnClick(canvasRef, ctxRef) // We will draw a line on click and drag!

  return <StyledCanvas ref={canvasRef} />
}

type Point = {
  x: number
  y: number
}

// We know how to draw a line, so we can extract it into a function
const drawLine = (ctx: CanvasRenderingContext2D, startPoint: Point, endPoint: Point) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.beginPath()
  ctx.moveTo(startPoint.x, startPoint.y)
  ctx.lineTo(endPoint.x, endPoint.y)
  ctx.stroke()
  ctx.closePath()
}

// Now, let's make it interactive
const useDrawLineOnClick = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  ctxRef: React.RefObject<CanvasRenderingContext2D | null>,
) => {
  // store click points coordinates
  const [startPoint] = useState<Point | null>(null)
  const [endPoint] = useState<Point | null>(null)

  // get canvas coordinates to calculate mouse position
  const canvasCoordinatesRef = useRef<{ left: number; top: number }>({ left: 0, top: 0 })
  useEffect(() => {
    if (canvasRef.current) canvasCoordinatesRef.current = canvasRef.current.getBoundingClientRect()
  }, [canvasRef])


  // draw the line when we update our Points on click
  useEffect(() => {
    if (!startPoint || !endPoint) return
    drawLine(ctxRef.current!, startPoint, endPoint)
  }, [startPoint, endPoint, ctxRef])


  // Mouse events handlers to implement
  const handleMouseDown = useCallback(
    () => {}, // TODO: implement the handler
    [],
  )

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const { left, top } = canvasCoordinatesRef.current
      console.debug('mousemove', event.clientX - left, event.clientY - top)
      
      // TODO: implement the handler
    },
    [],
  )

  const handleMouseUp = useCallback(
    () => {}, // TODO: implement the handler
    [],
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseDown, handleMouseUp, handleMouseMove])
}

export const Level5 = () => (
  <Level level={5} title="Draw a line on click+drag">
    <Level5Canvas />
  </Level>
)
