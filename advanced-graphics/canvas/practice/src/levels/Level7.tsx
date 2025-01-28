import { useEffect, useRef } from 'react'
import { StyledCanvas } from '../components/Canvas'
import { useCanvas } from '../components/CanvasHooks'
import { Level } from '../components/Level'

// Types
type ConfettiShape = 'square' | 'circle'
const shapes: ConfettiShape[] = ['square', 'circle']

interface Confetti {
  // Position
  x: number
  y: number
  rotation: number
  // Appearance
  color: string
  shape: ConfettiShape
  size: number
  opacity: number
  // Physics
  velocityX: number
  velocityY: number
  // Animation
  phase: number
}

// Constants
const PHYSICS = {
  GRAVITY: 0.1,   // Downward acceleration
  DRAG: 0.98,     // Air resistance (1 = no drag, 0 = full drag)
}

const ANIMATION = {
  FADE_SPEED: 0.006,      // How quickly confetti fade out
  ROTATION_SPEED: 0.02,   // How quickly confetti spin
  PHASE_SPEED: 0.05,      // Speed of the 3D effect
}

const CANNON = {
  SPREAD: Math.PI / 3,    // 60 degree spread
  MIN_SPEED: 10,
  MAX_SPEED: 15,
}

const CONFETTI_AMOUNT = 100

const colors = ['#ff4646', '#5cf25c', '#7a7aff', '#ffff7a', '#ff00ff']


// Main component
const Level7Canvas = () => {
  const { canvasRef, ctxRef } = useCanvas()
  useConfettis(canvasRef, ctxRef)
  return <StyledCanvas ref={canvasRef} />
}

// Confettis
const useConfettis = (canvasRef: React.RefObject<HTMLCanvasElement>, ctxRef: React.RefObject<CanvasRenderingContext2D | null>) => {
  const confettis = useRef<Confetti[]>([])
  const animationFrameId = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) return

    // Create a single confetti at the cannon position
    const createConfetti = (): Confetti => {
      // Start from bottom center
      const cannonX = canvas.width / 2
      const cannonY = canvas.height

      // Calculate random angle within spread
      const angle = -Math.PI/2 + (Math.random() - 0.5) * CANNON.SPREAD
      
      // Set initial velocity based on angle
      const speed = CANNON.MIN_SPEED + Math.random() * (CANNON.MAX_SPEED - CANNON.MIN_SPEED)
      const velocityX = Math.cos(angle) * speed
      const velocityY = Math.sin(angle) * speed

      return {
        // Position
        x: cannonX,
        y: cannonY,
        rotation: Math.random() * Math.PI * 2,
        // Appearance
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        size: 2.5 + Math.random() * 5,
        opacity: 1,
        // Physics
        velocityX,
        velocityY,
        // Animation
        phase: Math.random() * Math.PI * 2,
      }
    }

    // Initialize confetti pool
    for (let i = 0; i < CONFETTI_AMOUNT; i++) {
      confettis.current.push(createConfetti())
    }

    // Draw a single confetti with 3D effect
    const draw3DConfetti = (confetti: Confetti) => {
      ctx.save()
      
      // Position and basic rotation
      ctx.translate(confetti.x, confetti.y)
      ctx.rotate(confetti.rotation)
      
      // Apply 3D rotation effect
      const heightScale = Math.abs(Math.sin(confetti.phase))
      const skewAmount = Math.cos(confetti.phase) * 0.5
      ctx.transform(1, skewAmount, 0, heightScale, 0, 0)
      
      // Draw with current opacity
      ctx.globalAlpha = confetti.opacity
      ctx.fillStyle = confetti.color
      
      // Draw shape
      if (confetti.shape === 'square') {
        ctx.fillRect(-confetti.size / 2, -confetti.size / 2, confetti.size, confetti.size)
      } else {
        ctx.beginPath()
        ctx.arc(0, 0, confetti.size / 2, 0, Math.PI * 2)
        ctx.fill()
      }
      
      ctx.restore()
    }

    // Animation loop
    const animate = () => {
      console.debug('animate') // Problem: the animation keeps going after the confetti are not visible
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      confettis.current.forEach(confetti => {
        // Apply physics
        confetti.velocityY += PHYSICS.GRAVITY
        confetti.velocityX *= PHYSICS.DRAG
        confetti.velocityY *= PHYSICS.DRAG

        // Update position
        confetti.x += confetti.velocityX
        confetti.y += confetti.velocityY
        
        // Update animation
        confetti.rotation += ANIMATION.ROTATION_SPEED
        confetti.phase += ANIMATION.PHASE_SPEED
        confetti.opacity = Math.max(0, confetti.opacity - ANIMATION.FADE_SPEED)

        // Draw
        draw3DConfetti(confetti)

        // TODO: Remove if out of bounds or faded

        // TODO: Remove confetti if not visible
        
      })

      // TODO: render next frame only when there are still visible confettis
      animationFrameId.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup on dismount
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [canvasRef, ctxRef])
}

// helper function
// const isConfettiVisible = (confetti: Confetti, canvas: HTMLCanvasElement) => {
//   return (
//     confetti.y <= canvas.height + 20 &&
//     confetti.x >= -20 &&
//     confetti.x <= canvas.width + 20 &&
//     confetti.opacity > 0
//   )
// }

export const Level7 = () => (
  <Level level={7} title="Animate confettis">
    <Level7Canvas />
  </Level>
)
