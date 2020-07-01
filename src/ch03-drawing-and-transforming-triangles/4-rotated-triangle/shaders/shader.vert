attribute vec4 a_Position;
uniform float u_cosB, u_sinB;

void main() {
    gl_Position = vec4(
        a_Position.x * u_cosB - a_Position.y * u_sinB,
        a_Position.x * u_sinB + a_Position.y * u_cosB, 
        a_Position.z, 
        a_Position.w
    );
    // gl_PointSize = 10.0; // this is ignored when drawing gl.TRIANGLES
}