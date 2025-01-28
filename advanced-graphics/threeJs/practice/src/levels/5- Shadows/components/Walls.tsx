import * as THREE from "three";

export const WALL_SIZE = 30;
export const Walls = () => {
  return (
    <mesh position={[0, WALL_SIZE / 4 - 0.1, 0]} receiveShadow={true}>
      <boxGeometry args={[WALL_SIZE, WALL_SIZE / 2, WALL_SIZE]} />
      <meshPhongMaterial color={"#cccccc"} side={THREE.BackSide} />
    </mesh>
  );
};
