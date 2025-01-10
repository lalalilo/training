import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import vertexShader from "./shaders/lavaVertex.vert";
import fragmentShader from "./shaders/lavaFragment.frag";

// Scene
const scene = new THREE.Scene();

// Axes
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

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

// Shader material
const textureLoader = new THREE.TextureLoader();

const cloudTexture = textureLoader.load('/cloud.png');
cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;

const lavaTexture = textureLoader.load('/lavatile.jpg');
lavaTexture.colorSpace = THREE.SRGBColorSpace;
lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping;

const uniforms = {
    'fogDensity': {value: 0.01},
    'fogColor': {value: new THREE.Vector3(0, 0, 0)},
    'time': {value: 1.0},
    'uvScale': {value: new THREE.Vector2(2.0, 2.0)},
    'texture1': {value: cloudTexture},
    'texture2': {value: lavaTexture}
};
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
});
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
scene.add(cube); // Add cube to the scene

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth movement
controls.dampingFactor = 0.05; // Damping factor
controls.target.set(cube.position.x, cube.position.y, cube.position.z); // Focus on the cube

const stats = new Stats()
document.body.appendChild(stats.dom)

let parameters = {
    speed: 1,
}
const gui = new GUI()
gui.add(cube.rotation, 'x', 0, 10, 0.01)
gui.add(cube.rotation, 'y', 0, 10, 0.01)
gui.add(parameters, 'speed', 0, 20, 1).name("lava speed")

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    controls.update(); // Required for damping
    renderer.render(scene, camera);
    stats.update()
    uniforms['time'].value = clock.getElapsedTime() * parameters.speed;
}

// Handle Window Resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

camera.lookAt(cube.position);
