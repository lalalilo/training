import * as THREE from "three";
import {Mesh} from "three";

export const getPerspectiveCamera = (cube: Mesh) => {
    const camera = new THREE.PerspectiveCamera(
        75, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping plane
        1000 // Far clipping plane
    );
    // Move camera away from the cube
    camera.position.z = 5;

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    camera.lookAt(cube.position);
    return camera;
}