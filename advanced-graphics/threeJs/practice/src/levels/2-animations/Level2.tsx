import { LevelContainer, LevelTitle } from "../../components/Level";
import { useEffect, useRef } from "react";
import { Level2Solution } from "./Solution.tsx";
import { CANVAS_SIZE } from "../../App.tsx";

export const Level2 = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // https://threejs.org/docs/
    // https://threejs.org/manual/
    // keywords: wireframe, animation loop, OrbitControls, Stats, AxesHelper, GridHelper, GUI
    // code here
  }, []);

  return (
    <LevelContainer>
      <LevelTitle>Animations</LevelTitle>
      <Level2Solution />
      <div>
        <h2>Dev:</h2>
        <canvas ref={canvas} width={CANVAS_SIZE} height={CANVAS_SIZE} />
      </div>
    </LevelContainer>
  );
};
