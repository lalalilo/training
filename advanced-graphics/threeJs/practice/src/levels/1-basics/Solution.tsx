import * as THREE from "three";
import { useEffect, useRef } from "react";
import { CANVAS_SIZE } from "../../App.tsx";

export const Level1Solution = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current) return;

    // Scene
    const scene = new THREE.Scene();

    // Cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75, // Field of view
      canvas.current.width / canvas.current.height, // Aspect ratio
      0.1, // Near clipping plane
      1000, // Far clipping plane
    );
    camera.position.z = 5; // Move camera away from the cube

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas.current,
    });

    renderer.render(scene, camera);
  }, []);

  return (
    <div>
      <h2>Modèle:</h2>
      <canvas ref={canvas} width={CANVAS_SIZE} height={CANVAS_SIZE} />
    </div>
  );
};
