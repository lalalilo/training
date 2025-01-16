import * as THREE from "three";
import vertexShader from "./lavaVertex.vert";
import fragmentShader from "./lavaFragment.frag";

export const getLavaShaderMaterial = (timeUniform: { value: number }) => {
    const textureLoader = new THREE.TextureLoader();

    const cloudTexture = textureLoader.load('/cloud.png');
    cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;

    const lavaTexture = textureLoader.load('/lavatile.jpg');
    lavaTexture.colorSpace = THREE.SRGBColorSpace;
    lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping;

    const uniforms = {
        'fogDensity': {value: 0.01},
        'fogColor': {value: new THREE.Vector3(0, 0, 0)},
        'time': timeUniform,
        'uvScale': {value: new THREE.Vector2(1, 1)},
        'texture1': {value: cloudTexture},
        'texture2': {value: lavaTexture}
    };

    return new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
    });
}