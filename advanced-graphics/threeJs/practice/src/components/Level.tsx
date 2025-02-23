import styled from "styled-components";

export const LevelContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  canvas {
    border: 1px solid black;
  }
`;

export const LevelTitle = styled.h1`
  position: absolute;
  top: 20px;
  left: 20px;
  color: #333;
  font-size: 2rem;
  margin: 0;
  z-index: 1;
`;
