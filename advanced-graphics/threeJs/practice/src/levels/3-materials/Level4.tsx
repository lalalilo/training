import { LevelContainer, LevelTitle } from "../../components/Level";
import { useEffect, useRef } from "react";
import { Level4Solution } from "./Level4Solution.tsx";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { CANVAS_SIZE } from "../../App.tsx";

export const Level4 = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const helpers = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // https://threejs.org/docs/
    // https://threejs.org/manual/

    if (!canvas.current || !helpers.current) return;

    // Scene
    const scene = new THREE.Scene();

    // Cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // @TODO use another material compatible with shaders
    // @TODO use shaders from /assets/shaders
    const material = new THREE.MeshBasicMaterial();
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75, // Field of view
      canvas.current.width / canvas.current.height, // Aspect ratio
      0.1, // Near clipping plane
      1000, // Far clipping plane
    );
    camera.position.set(1, 1, 1); // Move camera away from the cube

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas.current,
    });

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(cube.position.x, cube.position.y, cube.position.z); // Focus on the cube

    // Axes
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // GUI
    const gui = new GUI({ autoPlace: false });
    helpers.current.appendChild(gui.domElement);
    gui.add(cube.rotation, "x", 0, 10, 0.1);
    gui.add(cube.rotation, "y", 0, 10, 0.1);
    gui.close();

    // Animation Loop
    function animate() {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    return () => {
      if (helpers.current) {
        helpers.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <LevelContainer>
      <LevelTitle>Materials - Shaders</LevelTitle>
      <Level4Solution />
      <div>
        <h2>Dev:</h2>
        <div ref={helpers} />
        <canvas ref={canvas} width={CANVAS_SIZE} height={CANVAS_SIZE} />
      </div>
    </LevelContainer>
  );
};
