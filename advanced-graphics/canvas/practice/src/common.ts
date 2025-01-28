// Types
export type ConfettiShape = 'square' | 'circle'
export const shapes: ConfettiShape[] = ['square', 'circle']

export interface Confetti {
  x: number
  y: number
  rotation: number
  color: string
  shape: ConfettiShape
  size: number
  opacity: number
  velocityX: number
  velocityY: number
  phase: number
}

export type Point = {
  x: number
  y: number
}

// Constants
export const PHYSICS = {
  GRAVITY: 0.1,
  DRAG: 0.98,
}

export const ANIMATION = {
  FADE_SPEED: 0.006,
  ROTATION_SPEED: 0.02,
  PHASE_SPEED: 0.05,
}

export const CANNON = {
  SPREAD: Math.PI / 3,
  MIN_SPEED: 10,
  MAX_SPEED: 15,
}

export const CONFETTI_AMOUNT = 100
export const colors = ['#ff4646', '#5cf25c', '#7a7aff', '#ffff7a', '#ff00ff']

// Drawing functions
export const drawLine = (ctx: CanvasRenderingContext2D, startPoint: Point, endPoint: Point) => {
  ctx.beginPath()
  ctx.setLineDash([5, 4])
  ctx.moveTo(startPoint.x, startPoint.y)
  ctx.lineTo(endPoint.x, endPoint.y)
  ctx.stroke()
  ctx.closePath()
}

export const getLineLength = (startPoint: Point, endPoint: Point) => {
  return Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2))
}

export const getRadiusFromLength = (length: number) => Math.sqrt(length) * 3

export const drawCircle = (ctx: CanvasRenderingContext2D, startPoint: Point, endPoint: Point) => {
  const { x, y } = startPoint
  const length = getLineLength(startPoint, endPoint)
  const radius = getRadiusFromLength(length)
  ctx.beginPath()
  ctx.setLineDash([])
  ctx.arc(x, y, radius, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.closePath()
}

export const draw3DConfetti = (ctx: CanvasRenderingContext2D, confetti: Confetti) => {
  ctx.save()
  ctx.translate(confetti.x, confetti.y)
  ctx.rotate(confetti.rotation)
  const heightScale = Math.abs(Math.sin(confetti.phase))
  const skewAmount = Math.cos(confetti.phase) * 0.5
  ctx.transform(1, skewAmount, 0, heightScale, 0, 0)
  ctx.globalAlpha = confetti.opacity
  ctx.fillStyle = confetti.color
  
  if (confetti.shape === 'square') {
    ctx.fillRect(-confetti.size / 2, -confetti.size / 2, confetti.size, confetti.size)
  } else {
    ctx.beginPath()
    ctx.arc(0, 0, confetti.size / 2, 0, Math.PI * 2)
    ctx.fill()
  }
  
  ctx.restore()
}

export const getLineAngle = (startPoint: Point, endPoint: Point) => {
  const dx = endPoint.x - startPoint.x
  const dy = endPoint.y - startPoint.y
  return Math.atan2(dy, dx)
}

interface Velocity {
  velocityX: number
  velocityY: number
}

export const getVelocity = (startPoint: Point, endPoint: Point, speed: number): Velocity => {
  // Get the base angle in the opposite direction of the line
  const baseAngle = getLineAngle(startPoint, endPoint) + Math.PI
  // Add some spread around the base angle
  const angle = baseAngle + (Math.random() - 0.5) * CANNON.SPREAD

  return {
    velocityX: Math.cos(angle) * speed,
    velocityY: Math.sin(angle) * speed,
  }
}

export const isConfettiVisible = (confetti: Confetti, canvas: HTMLCanvasElement) => {
  return (
    confetti.y <= canvas.height + 20 &&
    confetti.x >= -20 &&
    confetti.x <= canvas.width + 20 &&
    confetti.opacity > 0
  )
}