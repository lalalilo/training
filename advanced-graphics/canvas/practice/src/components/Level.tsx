import styled from "styled-components"
import { CanvasWrapper } from "./Canvas"

export const LevelContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`

export const LevelTitle = styled.h1`
  position: absolute;
  top: 20px;
  left: 20px;
  color: #333;
  font-size: 2rem;
  margin: 0;
  z-index: 1;
`

export const Level = ({children, level, title }: {children: React.ReactNode, level: number, title?: string}) => {
  return (
    <LevelContainer>
      <LevelTitle>Level {level}{title ? `: ${title}` : ''}</LevelTitle>
      <CanvasWrapper>
        {children}
      </CanvasWrapper>
    </LevelContainer>
  )
}