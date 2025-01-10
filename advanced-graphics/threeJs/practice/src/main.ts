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

// Custom shaders
const vertexShader = `
      varying vec3 vPosition;
      uniform float uTime;

      void main() {
        // Add a wave effect based on time and vertex position
        vec3 newPosition = position;
        newPosition.z += sin(newPosition.x * 5.0 + uTime) * 0.2;
        newPosition.y += sin(newPosition.z * 5.0 + uTime) * 0.2;

        vPosition = newPosition; // Pass the modified position to the fragment shader
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `;

const fragmentShader = `
      varying vec3 vPosition;
      uniform float uTime;

      void main() {
        // Create a color effect based on position and time
        vec3 color = vec3(
          sin(vPosition.x * 3.0 + uTime) * 0.5 + 0.5,
          sin(vPosition.y * 3.0 + uTime) * 0.5 + 0.5,
          sin(vPosition.z * 3.0 + uTime) * 0.5 + 0.5
        );
        gl_FragColor = vec4(color, 1.0);
      }
    `;

// Cube Geometry, Material, and Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
// Shader material
const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
        uTime: { value: 0.0 } // Uniform to pass time to the shader
    },
});
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

// Animation Loop
const clock = new THREE.Clock();
function animate() {
    controls.update(); // Required for damping
    renderer.render(scene, camera);
    stats.update()
    material.uniforms.uTime.value = clock.getElapsedTime(); // Update time
}

// Handle Window Resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

camera.lookAt(cube.position);
