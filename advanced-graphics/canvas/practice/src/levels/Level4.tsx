import { useEffect, useRef } from 'react'
import { StyledCanvas } from '../components/Canvas'
import { Level } from '../components/Level'

interface Line {
  x1: number
  y1: number
  x2: number
  y2: number
}

const Level4Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const line = useRef<Line>({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = 400
    canvas.height = 400
    
    ctx.lineWidth = 2

    line.current = {
      x1: 0,
      y1: 200,
      x2: 10,
      y2: 200,
    }
    
    const animate = () => {
      // clear the previous frame
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    
      // TODO: animate the line to grow to the right of the canvas

      ctx.beginPath()
      ctx.moveTo(line.current.x1, line.current.y1)
      ctx.lineTo(line.current.x2, line.current.y2)
      ctx.stroke()
      ctx.closePath()

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return <StyledCanvas ref={canvasRef} />
}

export const Level4 = () => (
  <Level level={4} title="Animate a line">
    <Level4Canvas />
  </Level>
)
