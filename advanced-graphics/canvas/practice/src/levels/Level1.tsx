import { useEffect, useRef } from 'react'
import { StyledCanvas } from '../components/Canvas'
import { Level } from '../components/Level'

const Level1Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // TODO: Set the canvas fixed dimensions
  }, [])

  return <StyledCanvas ref={canvasRef} />
}

export const Level1 = () => <Level level={1} title="Resize a canvas"><Level1Canvas /></Level>
  
