import { LevelContainer, LevelTitle } from "../../components/Level";
import { useEffect, useRef } from "react";
import { Level4Solution } from "./Level4Solution.tsx";

export const Level4 = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // https://threejs.org/docs/
    // https://threejs.org/manual/
    // keywords: shaders, uniforms
    // use shaders from /assets/shaders
    // code here
  }, []);

  return (
    <LevelContainer>
      <LevelTitle>Materials - Shaders</LevelTitle>
      <Level4Solution />
      <div>
        <h2>Dev:</h2>
        <canvas ref={canvas} width={400} height={400} />
      </div>
    </LevelContainer>
  );
};
