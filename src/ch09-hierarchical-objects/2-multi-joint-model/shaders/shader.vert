attribute vec4 a_Position;
attribute vec4 a_Normal;

uniform vec3 u_LightDirection;
uniform mat4 u_MvpMatrix;
uniform mat4 u_NormalMatrix;

varying vec4 v_Color;

void main() {
    gl_Position = u_MvpMatrix * a_Position;
    vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
    vec4 color = vec4(0.8, 0.4, 0.0, 0.8);
    vec3 diffuse = color.rgb * dot(normal, u_LightDirection) + vec3(0.2);
    v_Color = vec4(diffuse, 1.0);
}