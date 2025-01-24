import { Canvas, Euler, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { OrbitControls, useHelper, useTexture } from "@react-three/drei";
import * as THREE from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import checkerTexture from "../../assets/textures/checker.png";
import { CANVAS_SIZE } from "../../App.tsx";
import { useDatGUI } from "../../hooks/useDatGUI.ts";

export const Level6Solution = () => {
  const helpers = useRef<HTMLDivElement>(null);
  const gui = useDatGUI(helpers);

  return (
    <div>
      <h2>Modèle:</h2>
      <div ref={helpers} />
      <Canvas
        camera={{ position: [0, 10, 20], fov: 45, near: 0.1, far: 100 }}
        style={{
          background: "#000000",
          width: CANVAS_SIZE,
          height: CANVAS_SIZE,
        }}
        shadows={true}
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

const wallSize = 30;
const Walls = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhongMaterial>(null);

  return (
    <mesh
      ref={meshRef}
      position={[0, wallSize / 4 - 0.1, 0]}
      receiveShadow={true}
    >
      <boxGeometry args={[wallSize, wallSize / 2, wallSize]} />
      <meshPhongMaterial
        ref={materialRef}
        color={"#cccccc"}
        side={THREE.BackSide}
      />
    </mesh>
  );
};

const minus90Deg = Math.PI * -0.5;
const rotation: Euler = [minus90Deg, 0, 0];
const Floor = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhongMaterial>(null);

  const texture = useTexture(checkerTexture, (texture) => {
    texture.colorSpace = THREE.LinearSRGBColorSpace;
  });
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.repeat.set(wallSize / 2, wallSize / 2);

  useEffect(() => {
    if (!meshRef.current || !materialRef.current) return;
  }, []);

  return (
    <mesh ref={meshRef} receiveShadow={true} rotation={rotation}>
      <planeGeometry args={[wallSize, wallSize]} />
      <meshPhongMaterial map={texture} ref={materialRef} />
    </mesh>
  );
};

const cubeSize = 4;
const Cube = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhongMaterial>(null);

  return (
    <mesh
      ref={meshRef}
      position={[cubeSize + 1, cubeSize / 2, 0]}
      castShadow={true}
      receiveShadow={true}
    >
      <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
      <meshPhongMaterial ref={materialRef} color={"#8AC"} />
    </mesh>
  );
};

const radius = 3;
const Polyhedron = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhongMaterial>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 1 * delta;
    meshRef.current.rotation.y += 1 * delta;
  });

  return (
    <mesh
      ref={meshRef}
      position={[-5, 5, 0]}
      castShadow={true}
      receiveShadow={true}
    >
      <icosahedronGeometry args={[radius, 0]} />
      <meshPhongMaterial ref={materialRef} color={"#CA8"} />
    </mesh>
  );
};

const Lights = ({ gui }: { gui: React.MutableRefObject<GUI | undefined> }) => {
  const lightRef = useRef<THREE.PointLight>(new THREE.PointLight());
  useHelper(lightRef, THREE.PointLightHelper, 1);

  useEffect(() => {
    if (!gui.current || !lightRef.current) return;
    const lightFolder = gui.current.addFolder("Light");
    lightFolder.add(lightRef.current.position, "x", -10, 20, 1);
    lightFolder.add(lightRef.current.position, "y", 1, 20, 1);
    lightFolder.add(lightRef.current.position, "z", -10, 10, 1);
    lightFolder.add(lightRef.current, "intensity", 0, 200, 1);
    lightFolder.open();
  }, []);

  return (
    <pointLight
      args={[0xffffff]}
      position={[0, 10, 0]}
      ref={lightRef}
      castShadow={true}
      intensity={100}
    />
  );
};
