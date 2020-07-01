attribute vec4 a_Position;
uniform mat4 u_xformMatrix;

void main() {
    gl_Position = u_xformMatrix * a_Position;
    // gl_PointSize = 10.0; // this is ignored when drawing gl.TRIANGLES
}