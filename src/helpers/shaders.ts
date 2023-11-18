export const vertex = `
    uniform float pointSize;

    void main() {
        gl_PointSize = pointSize;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`

export const fragment = `
    uniform vec3 pointColor;

    void main() {
        vec2 uv = gl_PointCoord - vec2(0.5); // Center the coordinates at the point's center
        float distance = length(uv);

        // Discard any pixels outside of the circle
        if (distance > 0.5) {
            discard;
        }

        gl_FragColor = vec4(1, 1, 1, 1);
    }
`
