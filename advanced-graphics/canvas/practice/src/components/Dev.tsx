import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { LevelContainer, LevelTitle } from './Level'

const CanvasWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 100%;
`

const CanvasContainer = styled.canvas`
  border: 1px solid #333;
`

interface Confetti {
  x: number
  y: number
  size: number
  rotation: number
}

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameId = useRef<number>()
  const phase = useRef(0)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 400
    canvas.height = 400

    // Create a single confetti in the middle of the canvas
    const confetti: Confetti = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      size: 60,
      rotation: 0
    }

    const draw3DConfetti = (x: number, y: number, size: number, rotation: number, phase: number) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      
      // Calculate 3D rotation effect
      const heightScale = Math.abs(Math.sin(phase))
      const skewAmount = Math.cos(phase) * 0.5
      
      // Apply transforms for 3D effect
      ctx.transform(1, skewAmount, 0, heightScale, 0, 0)
      
      // Draw the confetti
      ctx.fillStyle = '#ff4646'
      ctx.fillRect(-size / 2, -size / 2, size, size)
      
      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      draw3DConfetti(confetti.x, confetti.y, confetti.size, confetti.rotation, phase.current)
      
      // Update animation
      phase.current += 0.05
      confetti.rotation += 0.02

      animationFrameId.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [])

  return <CanvasContainer ref={canvasRef} />
}

export const Dev = () => {
  return (
    <LevelContainer>
      <LevelTitle>Dev</LevelTitle>
      <CanvasWrapper>
        <Canvas />
      </CanvasWrapper>
    </LevelContainer>
  )
}
