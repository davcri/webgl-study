attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal;
uniform vec3 u_LightColor;
uniform vec3 u_LightDirection;
uniform mat4 u_MvpMatrix;
varying vec4 v_Color;

void main() {
    gl_Position = u_MvpMatrix * a_Position;
    v_Color = a_Color;
}