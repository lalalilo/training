import * as THREE from 'three';

import {getLavaShaderMaterial} from "./shaders/lavaShader.ts";
import {getPerspectiveCamera} from "./camera.ts";
import {getControls} from "./controls.ts";
import {getRenderer} from "./renderer.ts";
import Stats from "three/examples/jsm/libs/stats.module.js";

// Scene
const scene = new THREE.Scene();

// Axes
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Cube
const timeUniform = {value: 1.0}
const shaders = getLavaShaderMaterial(timeUniform);
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), shaders);
scene.add(cube);

// Camera
const camera = getPerspectiveCamera(cube);

// Stats
const stats = new Stats()
document.body.appendChild(stats.dom)

// Add OrbitControls and GUI
let parameters = {
    speed: 1,
}

// Animation Loop
const clock = new THREE.Clock();
const animate = () => {
    controls.update(); // Required for damping
    renderer.render(scene, camera);
    stats.update()
    timeUniform.value = clock.getElapsedTime() * parameters.speed;
}

// Renderer
const renderer = getRenderer(animate);

const controls = getControls(cube, camera, renderer, parameters);

