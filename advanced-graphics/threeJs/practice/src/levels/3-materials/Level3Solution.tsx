import * as THREE from "three";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import textureUrl from "../../assets/textures/Metal_Panel_010_basecolor.png";
import normalMapUrl from "../../assets/textures/Metal_Panel_010_normal.png";
import { CANVAS_SIZE } from "../../App.tsx";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

export const Level3Solution = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const helpers = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvas.current || !helpers.current) return;

    // Scene
    const scene = new THREE.Scene();

    // Texture loader
    const textureLoader = new THREE.TextureLoader();
    // https://3dtextures.me/2024/11/28/metal-panel-010/
    const texture = textureLoader.load(textureUrl); // Diffuse map
    const normalMap = textureLoader.load(normalMapUrl); // Normal map

    // Cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      normalMap,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Light
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(0, 0.3, 1);
    const lightHelper = new THREE.PointLightHelper(pointLight, 0.1);
    scene.add(pointLight, lightHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    ambientLight.intensity = 0.5;
    scene.add(ambientLight);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75, // Field of view
      canvas.current.width / canvas.current.height, // Aspect ratio
      0.1, // Near clipping plane
      1000, // Far clipping plane
    );
    camera.position.z = 1.5; // Move camera away from the cube

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

    const gui = new GUI({ autoPlace: false });
    helpers.current.appendChild(gui.domElement);
    gui.add(cube.rotation, "x", 0, 10, 0.1);
    gui.add(cube.rotation, "y", 0, 10, 0.1);
    gui.add(pointLight.position, "x", -1, 1, 0.1).name("Light Pos X");
    gui.add(pointLight.position, "y", -1, 1, 0.1).name("Light Pos Y");
    gui.add(material.normalScale, "x", 0, 10, 0.01).name("normalScale X");
    gui.add(material.normalScale, "y", 0, 10, 0.01).name("normalScale Y");
    gui.close();

    // Animation Loop
    function animate() {
      controls.update(); // Required for damping

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
