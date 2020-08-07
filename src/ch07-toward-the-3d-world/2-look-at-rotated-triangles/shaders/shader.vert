attribute vec4 a_Position;
attribute vec4 a_Color;

uniform mat4 u_ViewMatrix;
uniform mat4 u_ModelMatrix;

varying vec4 v_Color;

void main() {
    gl_Position = u_ViewMatrix * u_ModelMatrix * a_Position;
    gl_PointSize = 10.0;
    v_Color = a_Color;
}