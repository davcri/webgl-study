precision mediump float;
varying vec4 v_Color;

uniform vec3 u_LightColor;
uniform vec3 u_LightPosition;
uniform vec3 u_AmbientLight;
varying vec3 v_Normal;
varying vec3 v_Position;

void main(){
    vec3 normal = normalize(v_Normal);
    vec3 lightDirection = normalize(u_LightPosition  - v_Position);
    vec3 diffuse = u_LightColor * v_Color.rgb * max(dot(lightDirection, normal), 0.0);
    vec3 ambient = u_AmbientLight * v_Color.rgb;
    gl_FragColor = vec4(diffuse + ambient, v_Color.a);
}