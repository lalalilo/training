import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ANIMATION,
  CANNON,
  Confetti,
  PHYSICS,
  Point,
  colors,
  draw3DConfetti,
  drawCircle,
  drawLine,
  getLineAngle,
  getLineLength,
  isConfettiVisible,
  shapes,
} from '../common'
import { StyledCanvas } from '../components/Canvas'
import { useCanvas } from '../components/CanvasHooks'
import { Level } from '../components/Level'

const useDrawLineOnClick = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  ctxRef: React.RefObject<CanvasRenderingContext2D | null>,
  // we now have a function to call when the click is released
  onLineRelease?: (startPoint: Point, endPoint: Point) => void,
) => {
  // store click points coordinates
  const [startPoint, setStartPoint] = useState<Point | null>(null)
  const [endPoint, setEndPoint] = useState<Point | null>(null)
  // get canvas coordinates to calculate mouse position
  const canvasCoordinatesRef = useRef<{ left: number; top: number }>({ left: 0, top: 0 })
  useEffect(() => {
    if (canvasRef.current) canvasCoordinatesRef.current = canvasRef.current.getBoundingClientRect()
  }, [canvasRef])

  // mouse events handlers to update our Points
  const handleMouseDown = useCallback((event: MouseEvent) => {
    const { left, top } = canvasCoordinatesRef.current
    setStartPoint({ x: event.clientX - left, y: event.clientY - top })
  }, [])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (startPoint) {
      const { left, top } = canvasCoordinatesRef.current
      setEndPoint({ x: event.clientX - left, y: event.clientY - top })
    }
  }, [startPoint])

  const handleMouseUp = useCallback(() => {
    if (startPoint && endPoint && onLineRelease) {
      onLineRelease(startPoint, endPoint)
    }
    setStartPoint(null)
    setEndPoint(null)
    ctxRef.current?.clearRect(0, 0, ctxRef.current.canvas.width, ctxRef.current.canvas.height)
  }, [ctxRef, startPoint, endPoint, onLineRelease])

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

  // we now expose only the draw function in this hook
  const drawLineAndCircle = (ctx: CanvasRenderingContext2D) => {
    if (startPoint && endPoint) {
      drawLine(ctx, startPoint, endPoint)
      drawCircle(ctx, startPoint, endPoint)
    }
  }

  return { drawLineAndCircle }
}

const useConfetti = () => {
  const confettis = useRef<Confetti[]>([])

  const createConfetti = (startPoint: Point, endPoint: Point, lineLength: number): Confetti => {
    // Scale speed based on line length
    const baseMinSpeed = (CANNON.MIN_SPEED + lineLength * 0.05) / 4
    const baseMaxSpeed = (CANNON.MAX_SPEED + lineLength * 0.075) / 2

    // exponential distribution to create many fast confetti and less slow confetti
    const speedFactor = Math.pow(Math.random(), 2)
    const speed = baseMinSpeed + speedFactor * (baseMaxSpeed - baseMinSpeed)

    // Scale spread based on line length and speed
    const spread = CANNON.SPREAD * (0.5 + Math.min(2, lineLength / 200))
    const angle = getLineAngle(startPoint, endPoint) + Math.PI
    const spreadAngle = angle - spread / 2 + Math.random() * spread

    // Calculate base velocity using the spread angle
    const baseVelocityX = Math.cos(spreadAngle) * speed
    const baseVelocityY = Math.sin(spreadAngle) * speed

    // Perpendicular spread to create variations in initial velocities
    const perpendicularAngle = angle + Math.PI / 2
    const perpendicularSpread = speed * 1.5
    const perpOffset = (Math.random() - 0.5) * perpendicularSpread
    const velocityX = baseVelocityX + Math.cos(perpendicularAngle) * perpOffset
    const velocityY = baseVelocityY + Math.sin(perpendicularAngle) * perpOffset

    return {
      x: startPoint.x,
      y: startPoint.y,
      rotation: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      size: 2.5 + Math.random() * 5,
      opacity: 1,
      velocityX,
      velocityY,
      phase: Math.random() * Math.PI * 2,
    }
  }

  // we now expose a function to add confettis at a specific point
  const addConfettiAt = useCallback((startPoint: Point, endPoint: Point) => {
    const lineLength = getLineLength(startPoint, endPoint)

    // Create a variable amount of confetti based on the line length
    const confettisAmount = Math.min(150, Math.max(20, Math.floor(lineLength * 2)))
    for (let i = 0; i < confettisAmount; i++) {
        confettis.current.push(createConfetti(startPoint, endPoint, lineLength))
    }
  }, [])

  const drawConfetti = (ctx: CanvasRenderingContext2D) => {
    confettis.current = confettis.current.filter((confetti) => {
      confetti.velocityY += PHYSICS.GRAVITY
      confetti.velocityX *= PHYSICS.DRAG
      confetti.velocityY *= PHYSICS.DRAG
      confetti.x += confetti.velocityX
      confetti.y += confetti.velocityY
      confetti.rotation += ANIMATION.ROTATION_SPEED
      confetti.phase += ANIMATION.PHASE_SPEED
      confetti.opacity = Math.max(0, confetti.opacity - ANIMATION.FADE_SPEED)

      draw3DConfetti(ctx, confetti)

      return isConfettiVisible(confetti, ctx.canvas)
    })
  }

  return { drawConfetti, addConfettiAt }
}

const useCombinedAnimation = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  ctxRef: React.RefObject<CanvasRenderingContext2D | null>,
) => {
  
}

// Canvas Component
const Level8Canvas = () => {
  const { canvasRef, ctxRef } = useCanvas()
  useCombinedAnimation(canvasRef, ctxRef)
  return <StyledCanvas ref={canvasRef} />
}

export const Level8 = () => (
  <Level level={8} title="Merge line and confettis animations">
    <Level8Canvas />
  </Level>
)
