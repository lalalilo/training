import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

// Scene
const scene = new THREE.Scene();

// Axes
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// Camera
const camera = new THREE.PerspectiveCamera(
    75, // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
);
camera.position.z = 5; // Move camera away from the cube

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); // Set canvas size
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement); // Add renderer to the DOM

// Texture loader
const textureLoader = new THREE.TextureLoader();
// https://3dtextures.me/2024/11/28/metal-panel-010/
const texture = textureLoader.load('/Metal_Panel_010_basecolor.png'); // Diffuse map
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(2, 2);
const normalMap = textureLoader.load('/Metal_Panel_010_normal.png'); // Normal map
normalMap.wrapS = THREE.RepeatWrapping;
normalMap.wrapT = THREE.RepeatWrapping;
normalMap.repeat.set(2, 2);

// Cube Geometry, Material, and Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({map: texture, normalMap}); // Green
material.normalScale.set(2, 2);
const cube = new THREE.Mesh(geometry, material);
scene.add(cube); // Add cube to the scene

// Light
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(0,0.3,1)
const lightHelper = new THREE.PointLightHelper(pointLight)
scene.add(pointLight, lightHelper)

const ambientLight = new THREE.AmbientLight(0xffffff)
ambientLight.intensity = 0.5
scene.add(ambientLight)

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth movement
controls.dampingFactor = 0.05; // Damping factor
controls.target.set(cube.position.x, cube.position.y, cube.position.z); // Focus on the cube

const stats = new Stats()
document.body.appendChild(stats.dom)

const gui = new GUI()
gui.add(cube.rotation, 'x', 0, 10, 0.01)
gui.add(cube.rotation, 'y', 0, 10, 0.01)
gui.add(pointLight.position, 'x', -1, 1).name('Light Pos X')
gui.add(material.normalScale, 'x', 0, 10, 0.01).name('normalScale X')
gui.add(material.normalScale, 'y', 0, 10, 0.01).name('normalScale Y')

// Animation Loop
function animate() {
    controls.update(); // Required for damping
    renderer.render(scene, camera);
    stats.update()
}

// Handle Window Resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

camera.lookAt(cube.position);
