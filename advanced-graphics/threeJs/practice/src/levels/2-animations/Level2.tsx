import { LevelContainer, LevelTitle } from "../../components/Level";
import { useEffect, useRef } from "react";
import { Level2Solution } from "./Solution.tsx";
import { CANVAS_SIZE } from "../../App.tsx";
import * as THREE from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

export const Level2 = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const helpers = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // https://threejs.org/docs/
    // https://threejs.org/manual/
    if (!canvas.current || !helpers.current) return;
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#e6f0fe");

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75, // Field of view
      canvas.current.width / canvas.current.height, // Aspect ratio
      0.1, // Near clipping plane
      1000, // Far clipping plane
    );
    camera.position.setZ(5); // Move camera away from the cube

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas.current,
    });

    // Cube
    // @TODO show wireframe
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: "#4870de",
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // @TODO OrbitControls

    // @TODO Stats

    // @TODO Axes helper

    // @TODO Grid helper

    // Add basic GUI
    const gui = new GUI({ autoPlace: false });
    helpers.current.appendChild(gui.domElement);
    // @TODO add parameters to play with
    gui.close();

    // @TODO Animation loop
    renderer.render(scene, camera);

    // @TODO clean up function to clean helpers div
  }, []);

  return (
    <LevelContainer>
      <LevelTitle>Animations</LevelTitle>
      <Level2Solution />
      <div>
        <h2>Dev:</h2>
        <div ref={helpers} />
        <canvas ref={canvas} width={CANVAS_SIZE} height={CANVAS_SIZE} />
      </div>
    </LevelContainer>
  );
};
