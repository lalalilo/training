import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const CanvasContainer = styled.canvas`
  border: 1px solid #333;
  cursor: crosshair;
`

interface Point {
  x: number
  y: number
}

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState<Point | null>(null)
  const [endPoint, setEndPoint] = useState<Point | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    console.debug({
      width: canvas.width,
      height: canvas.height,
      wwidth: window.innerWidth,
      wheight: window.innerHeight

    })

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw line if we have both points
    if (isDrawing && startPoint && endPoint) {
      ctx.beginPath()
      ctx.moveTo(startPoint.x, startPoint.y)
      ctx.lineTo(endPoint.x, endPoint.y)
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }, [isDrawing, startPoint, endPoint])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    setStartPoint({ x, y })
    setEndPoint({ x, y })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setEndPoint({ x, y })
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
    setStartPoint(null)
    setEndPoint(null)
  }

  return (
    <CanvasContainer
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  )
}
