attribute vec4 a_Position;
uniform vec4 u_Translation;

void main() {
    gl_Position = a_Position + u_Translation;
    // gl_PointSize = 10.0; // this is ignored when drawing gl.TRIANGLES
}