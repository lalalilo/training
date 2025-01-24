import { Canvas } from "@react-three/fiber";
import { MutableRefObject, useEffect, useRef } from "react";
import { OrbitControls, useHelper, useTexture } from "@react-three/drei";
import * as THREE from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import textureUrl from "../../assets/textures/Metal_Panel_010_basecolor.png";
import normalMapUrl from "../../assets/textures/Metal_Panel_010_normal.png";
import { CANVAS_SIZE } from "../../App.tsx";
import { useDatGUI } from "../../hooks/useDatGUI.ts";

export const Level5Solution = () => {
  const helpers = useRef<HTMLDivElement>(null);
  const gui = useDatGUI(helpers);

  return (
    <div>
      <h2>Modèle:</h2>
      <div ref={helpers} />
      <Canvas
        camera={{ position: [1, 1, 1], fov: 75 }}
        style={{
          background: "#000000",
          width: CANVAS_SIZE,
          height: CANVAS_SIZE,
        }}
      >
        <OrbitControls enableDamping dampingFactor={0.05} />
        <axesHelper args={[5]} />
        <Cube gui={gui} />
        <Lights gui={gui} />
      </Canvas>
    </div>
  );
};

const Cube = ({ gui }: { gui: MutableRefObject<GUI | undefined> }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const texture = useTexture(textureUrl, (texture) => {
    texture.colorSpace = THREE.LinearSRGBColorSpace;
  });
  const normalMap = useTexture(normalMapUrl, (texture) => {
    texture.colorSpace = THREE.LinearSRGBColorSpace;
  });

  useEffect(() => {
    if (!gui.current || !meshRef.current || !materialRef.current) return;
    const cubeFolder = gui.current.addFolder("Cube");
    cubeFolder.add(meshRef.current.rotation, "x", 0, 10, 0.1);
    cubeFolder.add(meshRef.current.rotation, "y", 0, 10, 0.1);
    cubeFolder
      .add(materialRef.current.normalScale, "x", 0, 10, 0.1)
      .name("normalScale X");
    cubeFolder
      .add(materialRef.current.normalScale, "y", 0, 10, 0.1)
      .name("normalScale Y");
  }, []);

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        map={texture}
        normalMap={normalMap}
        ref={materialRef}
      />
    </mesh>
  );
};

const Lights = ({ gui }: { gui: React.MutableRefObject<GUI | undefined> }) => {
  const lightRef = useRef<THREE.PointLight>(new THREE.PointLight());
  useHelper(lightRef, THREE.PointLightHelper, 0.1);

  useEffect(() => {
    if (!gui.current || !lightRef.current) return;
    const lightFolder = gui.current.addFolder("Light");
    lightFolder.add(lightRef.current.position, "x", -1, 1, 0.1);
    lightFolder.add(lightRef.current.position, "y", -1, 1, 0.1);
    lightFolder.add(lightRef.current, "intensity", 0, 1, 0.1);
    lightFolder.open();
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight args={[0xffffff]} position={[0, 0.3, 1]} ref={lightRef} />
    </>
  );
};
