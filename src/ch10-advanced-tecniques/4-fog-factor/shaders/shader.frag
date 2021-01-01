precision mediump float;
varying vec4 v_Color;

uniform vec3 u_LightColor;
uniform vec3 u_LightPosition;
uniform vec3 u_AmbientLight;

uniform float t;

varying vec3 v_Normal;
varying vec3 v_Position;

// fog
varying float v_Dist;
uniform vec3 u_FogColor;
uniform vec2 u_FogDist;

void main(){
    vec3 normal = normalize(v_Normal);
    vec3 lightDirection = normalize(u_LightPosition  - v_Position);
    vec3 diffuse = u_LightColor * v_Color.rgb * max(dot(lightDirection, normal), 0.0);
    vec3 ambient = u_AmbientLight * v_Color.rgb;

    float fogFactor = (u_FogDist.y - v_Dist) / (u_FogDist.y - u_FogDist.x);
    fogFactor = clamp(fogFactor, 0.0, 1.0);
    vec3 col = mix(u_FogColor, (diffuse + ambient), fogFactor);
    gl_FragColor = vec4(col, v_Color.a);
}