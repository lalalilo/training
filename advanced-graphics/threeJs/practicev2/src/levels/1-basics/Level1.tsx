import { LevelContainer, LevelTitle } from "../../components/Level";
import { Level1Solution } from "./Solution.tsx";
import { useEffect, useRef } from "react";

export const Level1 = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // code here
  }, []);

  return (
    <LevelContainer>
      <LevelTitle>Basics</LevelTitle>
      <Level1Solution />
      <div>
        <h2>Dev:</h2>
        <canvas ref={canvas} width={400} height={400} />
      </div>
    </LevelContainer>
  );
};
