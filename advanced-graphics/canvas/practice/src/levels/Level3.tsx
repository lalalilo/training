import { useEffect, useRef } from 'react'
import { StyledCanvas } from '../components/Canvas'
import { Level } from '../components/Level'

const Level3Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 400
    canvas.height = 400

    // TODO: create a random amount of lines or other shapes on the canvas with random coordinates
    
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(canvas.width, canvas.height)
    ctx.stroke()
    ctx.closePath()

    ctx.beginPath()
    ctx.moveTo(0, canvas.height)
    ctx.lineTo(canvas.width, 0)
    ctx.stroke()
    ctx.closePath()
  }, [])

  return <StyledCanvas ref={canvasRef} />
}

export const Level3 = () => (
  <Level level={3} title="Draw random lines">
    <Level3Canvas />
  </Level>
)
