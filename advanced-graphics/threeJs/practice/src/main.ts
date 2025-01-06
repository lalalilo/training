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
pointLight.position.set(0,0.3,1)
const lightHelper = new THREE.PointLightHelper(pointLight)
scene.add(pointLight, lightHelper)

const ambientLight = new THREE.AmbientLight(0xffffff)
ambientLight.intensity = 0.5
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

camera.lookAt(cube.position);

// Track Dragging
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
const rotationSpeed = 0.005; // Control sensitivity

document.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMousePosition.x = event.clientX;
    previousMousePosition.y = event.clientY;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener('mousemove', (event) => {
    if (!isDragging) return;

    // Calculate Mouse Movement
    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    // Update Previous Position
    previousMousePosition.x = event.clientX;
    previousMousePosition.y = event.clientY;

    // Update Camera Position
    const angleX = deltaX * rotationSpeed;
    const angleY = deltaY * rotationSpeed;

    // Apply Rotation
    const currentPos = camera.position.clone();
    const spherical = new THREE.Spherical();
    spherical.setFromVector3(currentPos.sub(cube.position));

    spherical.theta -= angleX; // Horizontal rotation
    spherical.phi -= angleY; // Vertical rotation
    spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi)); // Clamp vertical angle

    // Convert spherical coordinates back to Cartesian
    const newPos = new THREE.Vector3().setFromSpherical(spherical);
    camera.position.copy(newPos.add(cube.position));
    camera.lookAt(cube.position);
});

