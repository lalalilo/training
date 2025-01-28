import { useEffect, useRef } from 'react'
import { StyledCanvas } from '../components/Canvas'
import { Level } from '../components/Level'

const Level2Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 400
    canvas.height = 400

    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(100, 200)
    ctx.lineTo(300, 200)
    ctx.stroke()
    ctx.closePath()

    // TODO: replace the line with the two diagonals of the canvas

  }, [])

  return <StyledCanvas ref={canvasRef} />
}

export const Level2 = () => (
  <Level level={2} title="Draw diagonal lines">
    <Level2Canvas />
  </Level>
)
