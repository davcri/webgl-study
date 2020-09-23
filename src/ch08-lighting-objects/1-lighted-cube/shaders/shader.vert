attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal;

uniform vec3 u_LightColor;
uniform vec3 u_LightDirection;
uniform mat4 u_MvpMatrix;
varying vec4 v_Color;

void main() {
    gl_Position = u_MvpMatrix * a_Position;
    vec3 normal = normalize(vec3(a_Normal));
    vec3 diffuse = vec3(a_Color) * u_LightColor * dot(normal, u_LightDirection);
    v_Color = vec4(a_Color.xyz * diffuse, 1.0);
}