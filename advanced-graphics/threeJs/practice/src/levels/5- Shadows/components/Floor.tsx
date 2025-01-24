import { Euler } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import checkerTexture from "../../../assets/textures/checker.png";
import * as THREE from "three";
import { WALL_SIZE } from "./Walls.tsx";

const minus90Deg = Math.PI * -0.5;
const rotation: Euler = [minus90Deg, 0, 0];
export const Floor = () => {
  const texture = useTexture(checkerTexture, (texture) => {
    texture.colorSpace = THREE.LinearSRGBColorSpace;
  });
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.repeat.set(WALL_SIZE / 2, WALL_SIZE / 2);

  return (
    <mesh rotation={rotation} receiveShadow={true}>
      <planeGeometry args={[WALL_SIZE, WALL_SIZE]} />
      <meshPhongMaterial map={texture} />
    </mesh>
  );
};
