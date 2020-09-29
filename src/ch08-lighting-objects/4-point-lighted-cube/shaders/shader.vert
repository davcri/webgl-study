attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal;

uniform vec3 u_LightColor;
uniform vec3 u_LightDirection;
uniform vec3 u_LightPosition;
uniform vec3 u_AmbientLight;
uniform mat4 u_ModelMatrix;
uniform mat4 u_MvpMatrix;
uniform mat4 u_NormalMatrix;
varying vec4 v_Color;

void main() {
    gl_Position = u_MvpMatrix * a_Position;
    vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
    vec4 vertexPos = u_ModelMatrix * a_Position;
    vec3 lightDirection = normalize(u_LightPosition - vertexPos.xyz);
    vec3 diffuse = a_Color.rgb * u_LightColor * dot(lightDirection, normal);
    vec3 ambient = u_AmbientLight * a_Color.rgb;
    v_Color = vec4(diffuse + ambient, 1.0);
}