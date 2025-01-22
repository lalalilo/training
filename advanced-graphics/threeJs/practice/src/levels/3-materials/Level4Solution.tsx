import * as THREE from "three";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { CANVAS_SIZE } from "../../App.tsx";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import vertexShader from "../../assets/shaders/vertexShader.vert";
import fragmentShader from "../../assets/shaders/fragmentShader.frag";

export const Level4Solution = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const helpers = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvas.current || !helpers.current) return;

    // Scene
    const scene = new THREE.Scene();

    // Cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0.0 }, // Uniform to pass time to the shader
      },
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
    camera.position.z = 2; // Move camera away from the cube

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

    // Axes
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // GUI
    const gui = new GUI({ autoPlace: false });
    helpers.current.appendChild(gui.domElement);
    const parameters = {
      speed: 1,
    };
    gui.add(parameters, "speed", 0, 10, 1);
    gui.close();

    // Animation Loop
    const clock = new THREE.Clock();
    function animate() {
      controls.update(); // Required for damping
      material.uniforms.uTime.value = clock.getElapsedTime() * parameters.speed; // Update time

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
