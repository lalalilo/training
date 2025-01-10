import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import {Mesh, PerspectiveCamera, WebGLRenderer} from "three";

export const getControls = (cube: Mesh, camera: PerspectiveCamera, renderer: WebGLRenderer, parameters: {
    speed: number
}) => {
    const gui = new GUI()
    gui.add(cube.rotation, 'x', 0, 10, 0.01)
    gui.add(cube.rotation, 'y', 0, 10, 0.01)
    gui.add(parameters, 'speed', 0, 20, 1).name("lava speed")

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth movement
    controls.dampingFactor = 0.05; // Damping factor
    controls.target.set(cube.position.x, cube.position.y, cube.position.z); // Focus on the cube
    return controls;
}