import * as THREE from "three";

export const getRenderer = (animate: () => void) => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight); // Set canvas size
    renderer.setAnimationLoop(animate);
    document.body.appendChild(renderer.domElement); // Add renderer to the DOM

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return renderer;
}