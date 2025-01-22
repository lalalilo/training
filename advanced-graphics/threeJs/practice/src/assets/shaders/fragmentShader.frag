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