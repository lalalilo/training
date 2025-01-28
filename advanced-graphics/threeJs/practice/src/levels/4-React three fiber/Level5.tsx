import { LevelContainer, LevelTitle } from "../../components/Level";
import { CANVAS_SIZE } from "../../App.tsx";
import { Level5Solution } from "./Solution.tsx";
import { useRef } from "react";
import { useDatGUI } from "../../hooks/useDatGUI.ts";
import * as THREE from "three";
import { useHelper, useTexture } from "@react-three/drei";
import textureUrl from "../../assets/textures/Metal_Panel_010_basecolor.png";
import normalMapUrl from "../../assets/textures/Metal_Panel_010_normal.png";
import { Canvas } from "@react-three/fiber";

const Exercise = () => {
  const helpers = useRef<HTMLDivElement>(null);
  // @ts-ignore
  const gui = useDatGUI(helpers);

  // @TODO refactor level 3 using React three fiber and drei
  // @TODO use <Canvas/>, <OrbitControls/>, <axesHelper/>
  // https://r3f.docs.pmnd.rs/getting-started/your-first-scene
  // https://drei.docs.pmnd.rs/getting-started/introduction

  return (
    <div>
      <h2>Dev:</h2>
      <div ref={helpers} />
      <Canvas
        style={{
          width: CANVAS_SIZE,
          height: CANVAS_SIZE,
        }}
      >
        Hello World
        <Cube />
        <Lights />
      </Canvas>
    </div>
  );
};

const Cube = () => {
  // @ts-ignore
  const texture = useTexture(textureUrl, (texture) => {
    texture.colorSpace = THREE.LinearSRGBColorSpace;
  });
  // @ts-ignore
  const normalMap = useTexture(normalMapUrl, (texture) => {
    texture.colorSpace = THREE.LinearSRGBColorSpace;
  });

  // @Todo use <mesh/> <boxGeometry/> <meshStandardMaterial/>

  return null;
};

const Lights = () => {
  const lightRef = useRef<THREE.PointLight>(new THREE.PointLight());
  useHelper(lightRef, THREE.PointLightHelper, 0.1);

  // @Todo use <ambientLight/> <pointLight/>

  return null;
};

export const Level5 = () => {
  return (
    <LevelContainer>
      <LevelTitle>React three fiber</LevelTitle>
      <Level5Solution />
      <Exercise />
    </LevelContainer>
  );
};
