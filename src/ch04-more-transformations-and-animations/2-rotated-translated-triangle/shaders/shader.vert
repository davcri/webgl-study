attribute vec4 a_Position;
uniform mat4 u_modelMatrix;

void main() {
    gl_Position = u_modelMatrix * a_Position;
}