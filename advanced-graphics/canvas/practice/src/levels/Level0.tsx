import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { LevelContainer, LevelTitle } from '../components/Level'

const CanvasWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;
  height: 100%;
`

const StyledCanvas = styled.canvas`
  margin: auto;
  border: 1px solid #333;
`

export const Level0Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // TODO: Set canvas fixed dimensions
  }, [])

  return <StyledCanvas ref={canvasRef} />
}

export const Level0 = () => {
  return (
    <LevelContainer>
      <LevelTitle>Level 0</LevelTitle>
      <CanvasWrapper>
        <Level0Canvas />
      </CanvasWrapper>
    </LevelContainer>
  )
}
