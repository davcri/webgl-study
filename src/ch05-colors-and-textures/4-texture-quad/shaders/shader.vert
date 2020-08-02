attribute vec4 a_Position;
attribute vec2 a_TextureCoord;
varying vec2 v_TextureCoord;

void main() {
    gl_Position = a_Position;
    v_TextureCoord = a_TextureCoord;
}
