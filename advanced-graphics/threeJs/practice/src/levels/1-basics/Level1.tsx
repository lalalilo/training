import { LevelContainer, LevelTitle } from "../../components/Level";
import { Level1Solution } from "./Solution.tsx";
import { useEffect, useRef } from "react";
import { CANVAS_SIZE } from "../../App.tsx";

export const Level1 = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // https://threejs.org/docs/
    // https://threejs.org/manual/
    if (!canvas.current) return;
    /*
        CODE HERE!
    */

    // Scene

    // Cube
    // BoxGeometry, MeshBasicMaterial, Mesh

    // Camera
    // PerspectiveCamera

    // Renderer
    // WebGLRenderer
  }, []);

  return (
    <LevelContainer>
      <LevelTitle>Basics</LevelTitle>
      <Level1Solution />
      <div>
        <h2>Dev:</h2>
        <canvas ref={canvas} width={CANVAS_SIZE} height={CANVAS_SIZE} />
      </div>
    </LevelContainer>
  );
};
