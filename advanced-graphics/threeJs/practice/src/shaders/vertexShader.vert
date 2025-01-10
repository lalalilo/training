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