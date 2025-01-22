import { LevelContainer, LevelTitle } from "../../components/Level";
import { Level3Solution } from "./Level3Solution.tsx";
import { useEffect, useRef } from "react";
import { CANVAS_SIZE } from "../../App.tsx";

export const Level3 = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // https://threejs.org/docs/
    // https://threejs.org/manual/
    // keywords: texture, normal map, lights
    // use Metal_Panel textures from /assets/textures (or try others from this websites https://3dtextures.me/)
    // code here
  }, []);

  return (
    <LevelContainer>
      <LevelTitle>Materials - Textures</LevelTitle>
      <Level3Solution />
      <div>
        <h2>Dev:</h2>
        <canvas ref={canvas} width={CANVAS_SIZE} height={CANVAS_SIZE} />
      </div>
    </LevelContainer>
  );
};
