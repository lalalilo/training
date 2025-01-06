import * as THREE from 'three';

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

// Cube Geometry, Material, and Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({color: 0x00ff00}); // Green
const cube = new THREE.Mesh(geometry, material);
scene.add(cube); // Add cube to the scene

// Light
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(1,1,1)
const lightHelper = new THREE.PointLightHelper(pointLight)
scene.add(pointLight, lightHelper)

const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(ambientLight)


// Animation Loop
function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}


// Handle Window Resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

