import React, { useLayoutEffect, useRef } from 'react';
import { useCurrentFrame } from 'remotion';

// =============================================================================
// Painterly WebGL shaders for the ink episodes (same pattern as geo-shorts'
// ShaderSun / BHShader: a fragment shader drawn into a <canvas> every frame at a
// small resolution and scaled up by CSS - soft edges suit the watercolour look).
// The laptop has no graphics card: renders need chromiumOptions gl 'angle'.
// Colours are posterized into a few tones so they sit with the flat ink drawings.
//   InkSky      - watercolour sky with drifting cloud bands; stars at night
//   CaveRock    - living stone texture for cave walls
//   FireLight   - flickering warm light pooling around a fire/torch (screen blend)
//   PaperWash   - faint, slowly blooming watercolour on the paper (multiply)
// =============================================================================
const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;
const LIB = `
precision highp float;
uniform vec2 res; uniform float t; uniform vec4 u;   // u = per-shader parameters
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 w = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), w.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), w.x), w.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a*noise(p); p *= 2.03; a *= 0.5; } return v; }
float steps(float x, float n){ return floor(x * n + 0.5) / n; }
`;

// u.x: 0 night, 1 dusk, 2 day
const SKY = LIB + `
void main(){
  vec2 uv = gl_FragCoord.xy / res;            // y = 0 at the bottom (horizon)
  float mode = u.x;
  vec3 top, low;
  if (mode < 0.5) { top = vec3(0.09, 0.11, 0.24); low = vec3(0.23, 0.25, 0.42); }
  else if (mode < 1.5) { top = vec3(0.55, 0.66, 0.80); low = vec3(0.96, 0.72, 0.52); }
  else { top = vec3(0.56, 0.74, 0.86); low = vec3(0.93, 0.88, 0.76); }
  float g = uv.y + 0.035 * (fbm(vec2(uv.x * 3.0, uv.y * 2.0) + t * 0.01) - 0.5);   // soft, uneven like a wash
  vec3 col = mix(low, top, smoothstep(0.0, 1.0, g));
  // drifting watercolour cloud bands
  vec2 q = vec2(uv.x * 2.4 + t * 0.012, uv.y * 5.0);
  float c = fbm(q + fbm(q * 1.7 + t * 0.02));
  float band = smoothstep(0.5, 0.66, c) * smoothstep(0.12, 0.5, uv.y);
  vec3 cloud = mode < 0.5 ? vec3(0.28, 0.30, 0.48) : (mode < 1.5 ? vec3(1.0, 0.82, 0.70) : vec3(1.0, 0.98, 0.94));
  col = mix(col, cloud, smoothstep(0.0, 1.0, band) * 0.6);
  // stars at night, twinkling, fewer near the horizon
  if (mode < 0.5) {
    vec2 cell = floor(gl_FragCoord.xy / 3.0);
    float h = hash(cell);
    float tw = 0.5 + 0.5 * sin(t * (1.0 + 3.0 * hash(cell + 7.0)) + h * 40.0);
    col += vec3(1.0, 0.96, 0.85) * step(0.992, h) * tw * smoothstep(0.1, 0.5, uv.y);
  }
  // soft pigment grain
  col *= 0.94 + 0.06 * fbm(gl_FragCoord.xy * 0.08);
  gl_FragColor = vec4(col, 1.0);
}`;

const ROCK = LIB + `
void main(){
  vec2 uv = gl_FragCoord.xy / res.y;
  vec2 q = uv * 3.0;
  float n = fbm(q + fbm(q * 2.0 + t * 0.01) * 0.8);
  float s = steps(n, 5.0);
  vec3 a = vec3(0.42, 0.35, 0.28), b = vec3(0.63, 0.54, 0.44);
  vec3 col = mix(a, b, s);
  // painted cracks
  float cr = smoothstep(0.02, 0.0, abs(fbm(q * 1.4 + 5.0) - 0.5));
  col = mix(col, vec3(0.20, 0.16, 0.13), cr * 0.6);
  col *= 0.92 + 0.08 * noise(gl_FragCoord.xy * 0.12);
  gl_FragColor = vec4(col, 1.0);
}`;

// u.xy: light centre (0..1, y from the bottom), u.z: radius (fraction of height), u.w: strength
const LIGHT = LIB + `
void main(){
  vec2 uv = gl_FragCoord.xy / res.y;
  vec2 c = vec2(u.x * res.x / res.y, u.y);
  float flick = 0.85 + 0.15 * noise(vec2(t * 6.0, 1.0)) + 0.06 * sin(t * 23.0);
  float d = length(uv - c) / (u.z * flick);
  float wob = 0.06 * fbm(uv * 6.0 + t * 0.8);
  float l = clamp(1.0 - d - wob, 0.0, 1.0);
  l = steps(pow(l, 1.4), 5.0);              // toon light rings
  vec3 col = vec3(1.0, 0.62, 0.25) * l * u.w;
  gl_FragColor = vec4(col, 1.0);
}`;

const WASH = LIB + `
void main(){
  vec2 uv = gl_FragCoord.xy / res.y;
  float n = fbm(uv * 2.2 + vec2(t * 0.01, -t * 0.008));
  float edge = smoothstep(0.48, 0.52, n) - smoothstep(0.52, 0.6, n);   // pigment pooling at bloom edges
  vec3 col = vec3(1.0) - vec3(0.05, 0.06, 0.04) * (n * 0.5 + edge * 0.8);
  gl_FragColor = vec4(col, 1.0);
}`;

const GL: React.FC<{ frag: string; w: number; h: number; res: [number, number]; u?: [number, number, number, number];
  style?: React.CSSProperties; speed?: number }> = ({ frag, w, h, res, u = [0, 0, 0, 0], style, speed = 1 }) => {
  const f = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const c = ref.current; if (!c) return;
    const gl = c.getContext('webgl', { preserveDrawingBuffer: true, premultipliedAlpha: false, alpha: true }); if (!gl) return;
    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const pr = gl.createProgram()!; gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(pr); gl.useProgram(pr);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.viewport(0, 0, res[0], res[1]);
    gl.uniform2f(gl.getUniformLocation(pr, 'res'), res[0], res[1]);
    gl.uniform1f(gl.getUniformLocation(pr, 't'), (f / 30) * speed);
    gl.uniform4f(gl.getUniformLocation(pr, 'u'), u[0], u[1], u[2], u[3]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }, [f, frag, res, u[0], u[1], u[2], u[3], speed]);
  return <canvas ref={ref} width={res[0]} height={res[1]} style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, ...style }} />;
};

export const InkSky: React.FC<{ mode: 'night' | 'dusk' | 'day'; height?: number }> = ({ mode, height = 760 }) => (
  <GL frag={SKY} w={1920} h={height} res={[384, Math.round((384 * height) / 1920)]} u={[mode === 'night' ? 0 : mode === 'dusk' ? 1 : 2, 0, 0, 0]} />
);

export const CaveRock: React.FC = () => <GL frag={ROCK} w={1920} h={1080} res={[384, 216]} />;

// x, y in screen pixels
export const FireLight: React.FC<{ x: number; y: number; r?: number; strength?: number }> = ({ x, y, r = 0.55, strength = 0.55 }) => (
  <GL frag={LIGHT} w={1920} h={1080} res={[320, 180]} u={[x / 1920, 1 - y / 1080, r, strength]} style={{ mixBlendMode: 'screen' }} />
);

export const PaperWash: React.FC<{ o?: number }> = ({ o = 1 }) => (
  <GL frag={WASH} w={1920} h={1080} res={[320, 180]} style={{ mixBlendMode: 'multiply', opacity: o }} />
);
