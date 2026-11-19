export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uBurst;
  uniform float uGain;
  uniform vec3  uPointer;
  uniform float uPointerForce;
  uniform float uWaveWidth;
  uniform float uWaveDepth;
  uniform float uVagabondMix;

  attribute vec3 aHuman;  attribute vec3 nHuman;
  attribute vec3 aRobot;  attribute vec3 nRobot;
  attribute vec3 aWave;   attribute vec2 aWaveGrid;
  attribute vec3 aVagabond; attribute vec3 aVagabondVel;
  attribute vec3 aCol;
  attribute vec4 aRand;
  attribute float aGroup;
  attribute float aHPart;
  attribute float aRPart;

  varying vec3  vColor;
  varying float vAlpha;

  vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec4 mod289(vec4 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m*m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  vec3 rotY(vec3 v, float a){ float c = cos(a), s = sin(a); return vec3(c*v.x + s*v.z, v.y, -s*v.x + c*v.z); }

  float terrain(float x, float z, float t) {
    float h = 0.0;
    h += sin(x * 0.16 + z * 0.10 + t * 0.18) * 1.90;
    h += sin(x * 0.34 - z * 0.23 + t * 0.27 + 1.3) * 1.00;
    h += sin(x * 0.71 + z * 0.52 - t * 0.36 + 2.1) * 0.42;
    h += sin(x * 1.45 - z * 1.10 + t * 0.55) * 0.14;
    h += sin(z * 0.75 + x * 0.05 + t * 0.22) * 0.90;
    return h;
  }

  vec3 waveGradient(float t) {
    vec3 c0 = vec3(0.23, 0.47, 0.98);  // STMF blue
    vec3 c1 = vec3(0.35, 0.55, 1.00);  // bright blue
    vec3 c2 = vec3(0.13, 0.82, 0.93);  // cyan
    vec3 c3 = vec3(0.40, 0.70, 1.00);  // light blue
    vec3 c4 = vec3(0.10, 0.60, 0.95);  // deep blue
    vec3 c = mix(c0, c1, smoothstep(0.00, 0.30, t));
    c = mix(c, c2, smoothstep(0.30, 0.55, t));
    c = mix(c, c3, smoothstep(0.55, 0.80, t));
    c = mix(c, c4, smoothstep(0.80, 1.00, t));
    return c * 1.3;
  }

  void main(){
    float m = clamp(uMorph, 0.0, 3.0);
    float seg = floor(min(m, 2.0));
    float t = fract(m);
    if (m >= 2.0) { seg = 2.0; t = m - 2.0; }

    float rot = 0.05 * uTime;
    if (aGroup > 1.5 && aGroup < 4.5) {
      float dirS = (abs(aGroup - 3.0) < 0.5) ? -1.0 : 1.0;
      rot = uTime * (0.22 + 0.09*(aGroup - 2.0)) * dirS;
    } else if (aGroup > 4.5) rot = uTime * 0.03;

    vec3 sP = rotY(position, rot);
    vec3 sN = rotY(normal, rot);
    if (aGroup > 0.5 && aGroup < 1.5) sP *= 1.0 + 0.06*sin(uTime*1.6 + aRand.x*6.0);

    vec3 wavePos;
    float waveIntensity = 1.0;
    if (aWaveGrid.x >= 0.0) {
      float wx = (aWaveGrid.x - 0.5) * uWaveWidth * 0.8;
      float wz = mix(2.0, -25.0, aWaveGrid.y);
      float wh = terrain(wx * 1.2, wz * 1.2, uTime);
      float wy = wh * 0.6 - 1.0;
      wavePos = vec3(wx, wy, wz);
      float hn = clamp((wh + 1.5) / 4.5, 0.0, 1.0);
      float crest = pow(hn, 2.2);
      float nearFade = mix(0.35, 1.0, smoothstep(0.0, 0.35, aWaveGrid.y));
      float farFade = mix(1.0, 0.30, aWaveGrid.y);
      float ax = abs(wx) / (uWaveWidth * 0.5);
      float edge = 1.0 - smoothstep(0.55, 1.0, ax);
      waveIntensity = (0.08 + 0.92 * crest) * nearFade * farFade * edge;
    } else {
      wavePos = aWave + vec3(sin(uTime * 0.2 + aRand.x * 3.0) * 0.3, mod(aRand.y * 15.0 + uTime * 0.1, 15.0) - 6.0, 0.0);
      waveIntensity = 0.3 + aRand.z * 0.3;
    }

    vec3 pA, pB, nA, nB;
    float burstScale = 1.0;

    if (seg < 0.5) { pA = sP; nA = sN; pB = aHuman; nB = nHuman; }
    else if (seg < 1.5) { pA = aHuman; nA = nHuman; pB = aRobot; nB = nRobot; }
    else { pA = aRobot; nA = nRobot; pB = wavePos; nB = vec3(0.0, 1.0, 0.0); burstScale = 1.5; }

    float spread = 0.5;
    float lt = clamp((t - aRand.y*spread) / (1.0 - spread), 0.0, 1.0);
    float e = lt*lt*lt*(lt*(lt*6.0 - 15.0) + 10.0);
    float burst = sin(lt * 3.14159265);

    vec3 base = mix(pA, pB, e);
    vec3 dir = normalize(base + vec3(0.0001, 0.0002, 0.0003));
    vec3 pos = base;

    vec3 vagabondCurrent = aVagabond + aVagabondVel * uTime * 50.0;
    vagabondCurrent = mod(vagabondCurrent + 10.0, 20.0) - 10.0;
    // Fix: use aRand instead of gl_VertexID to avoid sorted vertex issues
    float isVagabond = step(fract(aRand.x * 37.17 + aRand.y * 91.3), 0.12);
    float vagabondActive = isVagabond * uVagabondMix * (1.0 - smoothstep(0.0, 0.3, t));
    pos = mix(pos, vagabondCurrent, vagabondActive * 0.7);

    if (burst > 0.001) {
      vec3 q = base*0.8 + vec3(0.0, uTime*0.15, aRand.x*4.0);
      vec3 curl = vec3(snoise(q), snoise(q + vec3(31.4, 7.1, 0.0)), snoise(q + vec3(0.0, 17.3, 53.2)));
      vec3 swirl = cross(vec3(0.0, 1.0, 0.0), base);
      pos += dir * burst * (0.7 + aRand.x*2.2) * uBurst * burstScale + swirl * burst * (aRand.z - 0.3) * 1.1 + curl * burst * 0.9 * burstScale;
    }

    vec3 n = normalize(mix(nA, nB, e) + dir*burst*1.2);
    float amp = mix(0.032, 0.004, smoothstep(0.0, 2.0, m));
    if (m > 2.0) amp = mix(0.004, 0.0, smoothstep(2.0, 3.0, m));
    pos += n * snoise(base*1.7 + vec3(0.0, uTime*0.25, uTime*0.12)) * amp;

    float hw = (seg < 0.5) ? e : ((seg < 1.5) ? 1.0 - e : 0.0);
    float pl = clamp(dot(n, normalize(vec3(-0.55, 0.55, 0.6))) * 0.5 + 0.5, 0.0, 1.0);
    float dis = hw * pow(1.0 - pl, 2.2);
    pos += (vec3(-0.5, -0.35, 0.25) + n * 0.6) * dis * (0.10 + 0.30 * aRand.x) * (0.7 + 0.3 * sin(uTime * 0.4 + aRand.y * 6.28));

    vec2 dp = pos.xy - uPointer.xy;
    float push = smoothstep(0.8, 0.0, length(dp)) * uPointerForce;
    pos += normalize(vec3(dp, 0.5)) * push * 0.3;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    vec3 wgt;
    if (seg < 0.5) { wgt = vec3(1.0 - e, e, 0.0); }
    else if (seg < 1.5) { wgt = vec3(0.0, 1.0 - e, e); }
    else { wgt = vec3(0.0, 0.0, 1.0); }
    float waveWgt = (m > 2.0) ? smoothstep(2.0, 2.5, m) : 0.0;

    vec3 vn = normalize(normalMatrix * n);
    float facing = vn.z;
    float diff = max(dot(vn, normalize(vec3(-0.5, 0.6, 0.65))), 0.0);
    float rim = pow(1.0 - clamp(facing, 0.0, 1.0), 2.4);
    float back = smoothstep(-0.4, 0.2, facing);
    float rimW = dot(wgt, vec3(0.8, 0.5, 1.0));
    float light = 0.2 + 0.9*diff + rimW*1.1*rim;
    light *= mix(0.2, 1.0, back);
    if (aGroup > 0.5 && aGroup < 1.5) light = mix(light, 1.2, wgt.x);
    if (aRPart > 0.5) light = mix(light, max(light, 1.0), wgt.y);

    vec3 cS = vec3(0.23, 0.47, 0.98) * (0.7 + 0.8*aRand.z);
    if (aGroup > 0.5 && aGroup < 1.5) cS = mix(vec3(0.2, 0.5, 1.0), vec3(1.0), aRand.z*0.7) * 1.5;
    else if (aGroup > 1.5 && aGroup < 4.5) cS = ((abs(aGroup - 4.0) < 0.5) ? vec3(0.4, 0.5, 1.0) : vec3(0.13, 0.75, 1.0)) * 1.5;
    else if (aGroup > 4.5) cS = vec3(0.2, 0.4, 0.95) * 0.6;

    float lum = dot(aCol, vec3(0.299, 0.587, 0.114));
    float lit = smoothstep(0.18, 1.0, light);
    vec3 cH = mix(vec3(0.04, 0.10, 0.42), vec3(0.78, 0.90, 1.0), lit) * (0.55 + 0.6 * clamp(lum * 1.6, 0.0, 1.0));
    cH += vec3(0.3, 0.5, 0.9) * step(0.972, aRand.w) * lit;
    cH *= 0.92 + 0.08*sin(pos.y*120.0 - uTime*2.0);

    if (aHPart > 1.5) { cH = vec3(0.35, 0.60, 1.0) * 0.9; light = max(light, 0.55); }
    else if (aHPart > 0.5) { cH = aCol * 1.15; light = max(light, 0.5); }

    vec3 cR = vec3(0.50, 0.70, 1.0);
    float gridL = max(step(0.94, fract(pos.y*11.0)), step(0.95, fract((pos.x + pos.z*0.5)*13.0)));
    cR *= 0.85 + 0.9*gridL;
    if (aRPart > 0.5) cR = vec3(0.1, 0.8, 1.0) * (2.2 + 0.6*sin(uTime*3.0 + aRand.x*10.0));
    if (aRand.w > 0.985) cR = vec3(0.3, 0.6, 1.0) * 1.6;

    float waveU = clamp(0.5 + pos.x / 24.0, 0.0, 1.0);
    vec3 cW = waveGradient(waveU) * waveIntensity;
    cW = mix(cW, vec3(1.0), pow(clamp((waveIntensity - 0.5) * 2.0, 0.0, 1.0), 2.0) * 0.18);

    vec3 col;
    if (m < 2.0) { col = (cS*wgt.x + cH*wgt.y + cR*wgt.z) * light; }
    else { col = mix(cR * light, cW, waveWgt); }

    col = mix(col, vec3(0.3, 0.6, 1.0) * 1.5, burst*0.6);
    col += vec3(0.5, 0.75, 1.0) * burst*burst * 0.25;

    float sweepY = mod(uTime*0.6, 5.0) - 2.5;
    float band = exp(-pow((pos.y - sweepY)*6.0, 2.0));
    col += vec3(0.2, 0.7, 1.0) * band * 0.8 * (1.0 - waveWgt * 0.5);

    vec3 vagabondCol = vec3(0.3, 0.6, 1.0) * (0.5 + 0.5 * sin(uTime * 2.0 + aRand.x * 10.0));
    col = mix(col, vagabondCol, vagabondActive);

    col *= uGain;
    col = col / (1.0 + 0.25 * col);
    vColor = col;

    float baseAlpha = clamp(0.35 + 0.5*back, 0.0, 1.0) * 0.8 * (1.0 - 0.5 * dis);
    float waveAlpha = 0.5 + waveIntensity * 0.5;
    vAlpha = mix(baseAlpha, waveAlpha, waveWgt);
    vAlpha = mix(vAlpha, 0.5 + 0.3 * sin(uTime * 3.0 + aRand.y * 8.0), vagabondActive);

    float size = uSize * uPixelRatio * (0.6 + aRand.z*0.8);
    if (m < 2.0) { size *= dot(wgt, vec3(1.0, 0.8, 0.8)) * mix(1.0, 0.6 + 1.1 * pow(max(light, 0.0), 1.5), wgt.y); }
    else { float waveSize = 1.5 + waveIntensity * 1.0; size *= mix(0.8, waveSize, waveWgt); }
    size *= 1.0 + burst*0.9 + push*0.8;
    size = mix(size, size * 0.7, vagabondActive);
    gl_PointSize = size * (6.5 / -mv.z);
  }
`;

export const fragmentShader = /* glsl */ `
  varying vec3  vColor;
  varying float vAlpha;
  void main(){
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float a = pow(1.0 - d, 1.6);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

export const bgVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = vec4(position.xy, 1.0, 1.0); }
`;

export const bgFragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  void main(){
    vec2 p = vUv;
    vec3 c = mix(vec3(0.008, 0.015, 0.055), vec3(0.012, 0.025, 0.085), p.y);
    float d = p.x * 0.9 - p.y * 0.55;
    float b1 = exp(-pow((fract(d * 1.3 + 0.10 + uTime * 0.008) - 0.5) * 5.0, 2.0));
    float b2 = exp(-pow((fract(d * 0.8 + 0.47 - uTime * 0.006) - 0.5) * 4.0, 2.0));
    c += vec3(0.03, 0.08, 0.28) * (b1 * 0.34 + b2 * 0.26) * (1.0 - p.y * 0.5);
    gl_FragColor = vec4(c, 1.0);
  }
`;
