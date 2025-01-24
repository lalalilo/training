import { LevelContainer, LevelTitle } from "../../components/Level";
import { CANVAS_SIZE } from "../../App.tsx";
import { Level6Solution } from "./Solution.tsx";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useDatGUI } from "../../hooks/useDatGUI.ts";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { Walls } from "./components/Walls.tsx";
import { Floor } from "./components/Floor.tsx";

const Exercise = () => {
  const helpers = useRef<HTMLDivElement>(null);
  const gui = useDatGUI(helpers);

  // @TODO add lights and shadows to the scene
  // https://r3f.docs.pmnd.rs/getting-started/your-first-scene
  // https://threejs.org/manual/#en/shadows
  // keywords: shadow map

  return (
    <div>
      <h2>Dev:</h2>
      <div ref={helpers} />
      <Canvas
        camera={{ position: [0, 10, 20], fov: 45, near: 0.1, far: 100 }}
        style={{
          background: "#000000",
          width: CANVAS_SIZE,
          height: CANVAS_SIZE,
        }}
      >
        <OrbitControls target={[0, 5, 0]} />
        <axesHelper args={[50]} />
        <Cube />
        <Polyhedron />
        <Walls />
        <Floor />
        <Lights gui={gui} />
      </Canvas>
    </div>
  );
};

const Lights = ({ gui }: { gui: React.MutableRefObject<GUI | undefined> }) => {
  const lightRef = useRef();

  // @TODO implement light

  useEffect(() => {
    if (!gui.current || !lightRef.current) return;
    gui.current.addFolder("Light");
  }, []);

  return null;
};

const cubeSize = 4;
const Cube = () => {
  return (
    <mesh position={[cubeSize + 1, cubeSize / 2, 0]}>
      <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
      <meshBasicMaterial color={"#8AC"} />
    </mesh>
  );
};

const radius = 3;
const Polyhedron = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta;
    meshRef.current.rotation.y += delta;
  });

  return (
    <mesh ref={meshRef} position={[-5, 5, 0]}>
      <icosahedronGeometry args={[radius, 0]} />
      <meshBasicMaterial color={"#CA8"} />
    </mesh>
  );
};

export const Level6 = () => {
  return (
    <LevelContainer>
      <LevelTitle>Shadows</LevelTitle>
      <Level6Solution />
      <Exercise />
    </LevelContainer>
  );
};
