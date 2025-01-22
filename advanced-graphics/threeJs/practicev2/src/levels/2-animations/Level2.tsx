import { LevelContainer, LevelTitle } from "../../components/Level";
import { useEffect, useRef } from "react";
import { Level2Solution } from "./Solution.tsx";

export const Level2 = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // code here
  }, []);

  return (
    <LevelContainer>
      <LevelTitle>Animations</LevelTitle>
      <Level2Solution />
      <div>
        <h2>Dev:</h2>
        <canvas ref={canvas} width={400} height={400} />
      </div>
    </LevelContainer>
  );
};
