import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { useEffect, useRef } from "react";
import { CANVAS_SIZE } from "../../App.tsx";

export const Level2Solution = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const helpers = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvas.current || !helpers.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#e6f0fe");

    // Cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: "#4870de",
      wireframe: true,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75, // Field of view
      canvas.current.width / canvas.current.height, // Aspect ratio
      0.1, // Near clipping plane
      1000, // Far clipping plane
    );
    camera.position.set(2, 2, 2); // Move camera away from the cube

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas.current,
    });

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth movement
    controls.dampingFactor = 0.05; // Damping factor
    controls.target.set(cube.position.x, cube.position.y, cube.position.z); // Focus on the cube

    // Stats
    const stats = new Stats();
    stats.dom.style.position = "unset";
    helpers.current.appendChild(stats.dom);

    // Axes
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Grid
    const gridHelper = new THREE.GridHelper(10, 10);
    gridHelper.visible = false;
    scene.add(gridHelper);

    // Add basic GUI
    const gui = new GUI({ autoPlace: false });
    helpers.current.appendChild(gui.domElement);
    let parameters = {
      rotationSpeed: 1,
    };
    gui.add(parameters, "rotationSpeed", 0, 10, 1);
    gui.add(axesHelper, "visible");
    gui.add(gridHelper, "visible");
    gui.close();

    // Animation Loop
    function animate() {
      cube.rotation.x += 0.01 * parameters.rotationSpeed;
      cube.rotation.y += 0.01 * parameters.rotationSpeed;

      controls.update(); // Required for damping
      stats.update();

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
    <div>
      <h2>Modèle:</h2>
      <div ref={helpers} />
      <canvas ref={canvas} width={CANVAS_SIZE} height={CANVAS_SIZE} />
    </div>
  );
};
