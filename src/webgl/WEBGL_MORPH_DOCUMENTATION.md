# WebGL Particle Morph Animation - Documentation Complete

## Objectif

Animation WebGL de 22000 particules qui se transforment au scroll :
1. **Sphere** -> Explosion -> **Humain** -> Explosion -> **Robot/IA**

Represente la fusion de l'expertise humaine et de l'intelligence artificielle.

---

## Stack Technique

- **Three.js** (v0.160.0) via CDN
- **WebGL** avec shaders GLSL personnalises
- **Simplex Noise** pour deformation organique
- **Scroll-based animation** avec interpolation smooth

---

## Code Complet (index.html)

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WebGL Morph Test - Sphere to Human to Robot</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      background: #05080c;
      color: #fff;
      font-family: system-ui, sans-serif;
      overflow-x: hidden;
    }
    #canvas-container {
      position: fixed;
      inset: 0;
      z-index: 1;
    }
    .content {
      position: relative;
      z-index: 10;
      pointer-events: none;
    }
    .section {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .section h1 {
      font-size: clamp(2rem, 8vw, 5rem);
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: -0.02em;
    }
    .section p {
      font-size: 1.25rem;
      opacity: 0.6;
      max-width: 500px;
      margin-top: 1rem;
    }
    .phase-indicator {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 100;
      display: flex;
      gap: 1rem;
      background: rgba(0,0,0,0.5);
      padding: 1rem 2rem;
      border-radius: 2rem;
      backdrop-filter: blur(10px);
    }
    .phase {
      padding: 0.5rem 1rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      opacity: 0.4;
      transition: all 0.3s;
    }
    .phase.active {
      opacity: 1;
      background: rgba(13, 148, 136, 0.3);
      color: #14b8a6;
    }
    .scroll-hint {
      position: fixed;
      bottom: 6rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 100;
      animation: bounce 2s infinite;
      opacity: 0.5;
    }
    @keyframes bounce {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50% { transform: translateX(-50%) translateY(-10px); }
    }
  </style>
</head>
<body>
  <div id="canvas-container"></div>

  <div class="content">
    <section class="section">
      <div>
        <h1>Sphere</h1>
        <p>Point de depart - 22000 particules formant une sphere organique</p>
      </div>
    </section>
    <section class="section">
      <div>
        <h1>Explosion</h1>
        <p>Les particules se dispersent dans l'espace</p>
      </div>
    </section>
    <section class="section">
      <div>
        <h1>Humain</h1>
        <p>L'expertise humaine - Les particules reforment une silhouette humaine</p>
      </div>
    </section>
    <section class="section">
      <div>
        <h1>Transition</h1>
        <p>Nouvelle dispersion des particules</p>
      </div>
    </section>
    <section class="section">
      <div>
        <h1>Robot / IA</h1>
        <p>L'intelligence artificielle - Fusion homme-machine</p>
      </div>
    </section>
  </div>

  <div class="phase-indicator">
    <span class="phase active" data-phase="0">Sphere</span>
    <span class="phase" data-phase="1">Explosion</span>
    <span class="phase" data-phase="2">Humain</span>
    <span class="phase" data-phase="3">Transition</span>
    <span class="phase" data-phase="4">Robot</span>
  </div>

  <div class="scroll-hint">Scroll pour animer</div>

  <script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.160.0/build/three.module.js"
    }
  }
  </script>

  <script type="module">
    import * as THREE from 'three';

    const COUNT = 22000;
    const container = document.getElementById('canvas-container');
    const phases = document.querySelectorAll('.phase');

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    // Generate shape positions
    function generateSphere(count, radius = 1) {
      const positions = new Float32Array(count * 3);
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const t = golden * i;
        positions[i * 3] = Math.cos(t) * r * radius;
        positions[i * 3 + 1] = y * radius;
        positions[i * 3 + 2] = Math.sin(t) * r * radius;
      }
      return positions;
    }

    function generateHuman(count) {
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const section = Math.random();
        let x, y, z;

        if (section < 0.15) {
          // Head (sphere)
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = 0.18 + Math.random() * 0.02;
          x = r * Math.sin(phi) * Math.cos(theta);
          y = 1.1 + r * Math.cos(phi);
          z = r * Math.sin(phi) * Math.sin(theta);
        } else if (section < 0.4) {
          // Torso (cylinder)
          const angle = Math.random() * Math.PI * 2;
          const r = 0.25 + Math.random() * 0.08;
          x = Math.cos(angle) * r;
          y = 0.2 + Math.random() * 0.7;
          z = Math.sin(angle) * r * 0.6;
        } else if (section < 0.55) {
          // Left arm
          const t = Math.random();
          x = -0.35 - t * 0.5;
          y = 0.6 - t * 0.4 + (Math.random() - 0.5) * 0.1;
          z = (Math.random() - 0.5) * 0.08;
        } else if (section < 0.7) {
          // Right arm
          const t = Math.random();
          x = 0.35 + t * 0.5;
          y = 0.6 - t * 0.4 + (Math.random() - 0.5) * 0.1;
          z = (Math.random() - 0.5) * 0.08;
        } else if (section < 0.85) {
          // Left leg
          const t = Math.random();
          x = -0.12 + (Math.random() - 0.5) * 0.08;
          y = -t * 1.0;
          z = (Math.random() - 0.5) * 0.08;
        } else {
          // Right leg
          const t = Math.random();
          x = 0.12 + (Math.random() - 0.5) * 0.08;
          y = -t * 1.0;
          z = (Math.random() - 0.5) * 0.08;
        }

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
      }
      return positions;
    }

    function generateRobot(count) {
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const section = Math.random();
        let x, y, z;

        if (section < 0.12) {
          // Head (cube-ish)
          x = (Math.random() - 0.5) * 0.35;
          y = 1.0 + (Math.random() - 0.5) * 0.3;
          z = (Math.random() - 0.5) * 0.3;
        } else if (section < 0.18) {
          // Antenna
          x = (Math.random() - 0.5) * 0.05;
          y = 1.2 + Math.random() * 0.25;
          z = (Math.random() - 0.5) * 0.05;
        } else if (section < 0.2) {
          // Eyes (glowing points)
          const side = Math.random() > 0.5 ? 1 : -1;
          x = side * 0.08;
          y = 1.05 + (Math.random() - 0.5) * 0.05;
          z = 0.12 + Math.random() * 0.03;
        } else if (section < 0.45) {
          // Torso (rectangular, mechanical)
          x = (Math.random() - 0.5) * 0.5;
          y = 0.15 + Math.random() * 0.65;
          z = (Math.random() - 0.5) * 0.35;
          // Add some panel lines
          if (Math.random() < 0.2) {
            x = Math.round(x * 5) / 5;
            y = Math.round(y * 5) / 5;
          }
        } else if (section < 0.55) {
          // Left arm (segmented)
          const t = Math.random();
          const segment = Math.floor(t * 3);
          x = -0.35 - segment * 0.2 + (Math.random() - 0.5) * 0.06;
          y = 0.55 - t * 0.3 + (Math.random() - 0.5) * 0.08;
          z = (Math.random() - 0.5) * 0.08;
        } else if (section < 0.65) {
          // Right arm (segmented)
          const t = Math.random();
          const segment = Math.floor(t * 3);
          x = 0.35 + segment * 0.2 + (Math.random() - 0.5) * 0.06;
          y = 0.55 - t * 0.3 + (Math.random() - 0.5) * 0.08;
          z = (Math.random() - 0.5) * 0.08;
        } else if (section < 0.8) {
          // Left leg (mechanical)
          const t = Math.random();
          x = -0.15 + (Math.random() - 0.5) * 0.1;
          y = -t * 0.9;
          z = (Math.random() - 0.5) * 0.1;
        } else if (section < 0.95) {
          // Right leg (mechanical)
          const t = Math.random();
          x = 0.15 + (Math.random() - 0.5) * 0.1;
          y = -t * 0.9;
          z = (Math.random() - 0.5) * 0.1;
        } else {
          // Circuit patterns / details
          const angle = Math.random() * Math.PI * 2;
          const r = 0.2 + Math.random() * 0.3;
          x = Math.cos(angle) * r;
          y = 0.4 + (Math.random() - 0.5) * 0.6;
          z = Math.sin(angle) * r;
        }

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
      }
      return positions;
    }

    function generateExplosion(count) {
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const v = new THREE.Vector3().randomDirection().multiplyScalar(1.5 + Math.random() * 2);
        positions[i * 3] = v.x;
        positions[i * 3 + 1] = v.y;
        positions[i * 3 + 2] = v.z;
      }
      return positions;
    }

    // Pre-generate all shapes
    const shapes = {
      sphere: generateSphere(COUNT),
      explosion1: generateExplosion(COUNT),
      human: generateHuman(COUNT),
      explosion2: generateExplosion(COUNT),
      robot: generateRobot(COUNT)
    };

    // Shaders
    const vertexShader = `
      uniform float uTime;
      uniform float uProgress;
      uniform float uPhase;
      uniform float uHover;
      uniform vec3 uMouse;
      uniform float uPixelRatio;

      attribute vec3 aSphere;
      attribute vec3 aExplosion1;
      attribute vec3 aHuman;
      attribute vec3 aExplosion2;
      attribute vec3 aRobot;
      attribute float aRandom;

      varying float vNoise;
      varying float vPhase;

      // Simplex noise function
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
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
        vec4 s0 = floor(b0) * 2.0 + 1.0;
        vec4 s1 = floor(b1) * 2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      vec3 getPosition(float phase, float localProgress) {
        vec3 pos;
        float ease = smoothstep(0.0, 1.0, localProgress);
        float explosionFactor = sin(localProgress * 3.14159);

        if (phase < 1.0) {
          // Sphere to Explosion1
          pos = mix(aSphere, aExplosion1, ease);
          pos += normalize(pos) * explosionFactor * 0.5 * aRandom;
        } else if (phase < 2.0) {
          // Explosion1 to Human
          pos = mix(aExplosion1, aHuman, ease);
          pos += normalize(aExplosion1) * (1.0 - ease) * 0.3 * aRandom;
        } else if (phase < 3.0) {
          // Human to Explosion2
          pos = mix(aHuman, aExplosion2, ease);
          pos += normalize(pos) * explosionFactor * 0.5 * aRandom;
        } else {
          // Explosion2 to Robot
          pos = mix(aExplosion2, aRobot, ease);
          pos += normalize(aExplosion2) * (1.0 - ease) * 0.3 * aRandom;
        }

        return pos;
      }

      void main() {
        float phase = floor(uPhase);
        float localProgress = fract(uPhase);

        vec3 pos = getPosition(phase, localProgress);

        // Add noise animation
        float noise = snoise(pos * 1.5 + vec3(0.0, uTime * 0.2, uTime * 0.1));
        pos += normalize(pos) * noise * 0.08;

        // Hover effect
        float hover = smoothstep(0.8, 0.0, distance(normalize(pos), uMouse)) * uHover;
        pos += normalize(pos) * hover * 0.15;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        float size = 12.0 * uPixelRatio;
        size *= (0.5 + aRandom * 0.5);
        size *= (1.0 + hover * 0.5);
        gl_PointSize = size / -mvPosition.z;

        vNoise = noise;
        vPhase = uPhase;
      }
    `;

    const fragmentShader = `
      uniform float uPhase;
      varying float vNoise;
      varying float vPhase;

      void main() {
        float d = length(gl_PointCoord - 0.5);
        float alpha = pow(smoothstep(0.5, 0.0, d), 2.0);

        // Color based on phase
        vec3 sphereColor = vec3(0.05, 0.58, 0.63);    // Teal
        vec3 humanColor = vec3(0.2, 0.8, 0.6);        // Green-teal (organic)
        vec3 robotColor = vec3(0.4, 0.7, 1.0);        // Blue (tech)
        vec3 explosionColor = vec3(1.0, 0.6, 0.2);    // Orange (energy)

        float phase = floor(vPhase);
        float t = fract(vPhase);

        vec3 color;
        if (phase < 0.5) {
          color = mix(sphereColor, explosionColor, t * 0.5);
        } else if (phase < 1.5) {
          color = mix(explosionColor, humanColor, t);
        } else if (phase < 2.5) {
          color = mix(humanColor, explosionColor, t * 0.5);
        } else {
          color = mix(explosionColor, robotColor, t);
        }

        // Add glow based on noise
        color = mix(color, vec3(1.0), smoothstep(0.3, 0.9, vNoise) * 0.4);

        gl_FragColor = vec4(color, alpha * 0.85);
      }
    `;

    // Create geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(shapes.sphere.slice(), 3));
    geometry.setAttribute('aSphere', new THREE.BufferAttribute(shapes.sphere, 3));
    geometry.setAttribute('aExplosion1', new THREE.BufferAttribute(shapes.explosion1, 3));
    geometry.setAttribute('aHuman', new THREE.BufferAttribute(shapes.human, 3));
    geometry.setAttribute('aExplosion2', new THREE.BufferAttribute(shapes.explosion2, 3));
    geometry.setAttribute('aRobot', new THREE.BufferAttribute(shapes.robot, 3));

    const random = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) random[i] = Math.random();
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(random, 1));

    // Material
    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPhase: { value: 0 },
      uHover: { value: 0 },
      uMouse: { value: new THREE.Vector3(0, 0, 1) },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    const group = new THREE.Group();
    group.add(points);
    scene.add(group);

    // Mouse interaction
    const mouse = new THREE.Vector2();
    const ndc = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    window.addEventListener('mousemove', (e) => {
      ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
      ndc.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    });

    // Animation
    const clock = new THREE.Clock();
    let scrollY = 0;
    let targetScrollY = 0;

    window.addEventListener('scroll', () => {
      targetScrollY = window.scrollY;
    });

    function updatePhaseIndicator(phase) {
      phases.forEach((el, i) => {
        el.classList.toggle('active', i === Math.floor(phase));
      });
    }

    function animate() {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth scroll
      scrollY += (targetScrollY - scrollY) * 0.1;

      // Calculate phase based on scroll (5 sections = 4 transitions)
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollProgress = scrollY / maxScroll;
      const phase = scrollProgress * 4; // 0 to 4

      uniforms.uTime.value = time;
      uniforms.uPhase.value = phase;

      // Mouse smoothing
      mouse.x += (ndc.x - mouse.x) * 0.05;
      mouse.y += (ndc.y - mouse.y) * 0.05;

      // Tilt based on mouse
      group.rotation.y = mouse.x * 0.3;
      group.rotation.x = -mouse.y * 0.2;

      // Hover detection
      raycaster.setFromCamera(ndc, camera);
      const sphere = new THREE.Sphere(group.position, 2);
      const hit = raycaster.ray.intersectSphere(sphere, new THREE.Vector3());
      if (hit) {
        group.worldToLocal(hit);
        uniforms.uMouse.value.copy(hit).normalize();
        uniforms.uHover.value += (1 - uniforms.uHover.value) * 0.1;
      } else {
        uniforms.uHover.value *= 0.95;
      }

      // Gentle rotation
      points.rotation.y += delta * 0.1;

      updatePhaseIndicator(phase);
      renderer.render(scene, camera);
    }

    animate();
  </script>
</body>
</html>
```

---

## Structure des Formes

### 1. Sphere (Fibonacci)
- Distribution uniforme via algorithme Golden Ratio
- Radius: 1.0
- Deformation par Simplex Noise

### 2. Humain (Procedural)
- **Tete** (15%): Sphere r=0.18, y=1.1
- **Torse** (25%): Cylindre r=0.25, y=0.2-0.9
- **Bras gauche** (15%): Ligne x=-0.35 to -0.85
- **Bras droit** (15%): Ligne x=0.35 to 0.85
- **Jambe gauche** (15%): Ligne x=-0.12, y=0 to -1
- **Jambe droite** (15%): Ligne x=0.12, y=0 to -1

### 3. Robot (Procedural)
- **Tete carree** (12%): Box 0.35x0.3x0.3, y=1.0
- **Antenne** (6%): Ligne y=1.2-1.45
- **Yeux** (2%): Points lumineux
- **Torse** (25%): Rectangle avec lignes de panneaux
- **Bras segmentes** (20%): 3 segments par bras
- **Jambes mecaniques** (30%): Plus larges que humain
- **Circuits** (5%): Details decoratifs

### 4. Explosion
- Direction aleatoire uniforme
- Distance: 1.5 - 3.5 du centre

---

## Uniforms du Shader

| Uniform | Type | Description |
|---------|------|-------------|
| uTime | float | Temps ecoule (secondes) |
| uPhase | float | Phase actuelle 0-4 (partie entiere = phase, decimale = progression) |
| uHover | float | Intensite hover 0-1 |
| uMouse | vec3 | Direction souris normalisee |
| uPixelRatio | float | Device pixel ratio |

---

## Couleurs par Phase

| Phase | Couleur | RGB |
|-------|---------|-----|
| Sphere | Teal | (0.05, 0.58, 0.63) |
| Explosion | Orange | (1.0, 0.6, 0.2) |
| Humain | Green-Teal | (0.2, 0.8, 0.6) |
| Robot | Blue | (0.4, 0.7, 1.0) |

---

## Ameliorations Suggerees

1. **Modeles 3D reels**: Charger .glb/.obj pour humain et robot plus detailles
2. **Post-processing**: Ajouter UnrealBloomPass pour glow intense
3. **Trails**: Particules laissant des trainées pendant explosion
4. **Audio reactif**: Lier amplitude noise a l'audio
5. **Physique**: Ajouter gravite/velocite aux particules
6. **Textures**: Sprites au lieu de points pour plus de detail
7. **Interaction tactile**: Support touch events pour mobile
8. **Performance**: GPU instancing pour > 50k particules
9. **Easing avance**: Courbes de Bezier pour transitions plus cinematiques
10. **Particules secondaires**: Etincelles/debris pendant explosions

---

## Lancer le Test

```bash
cd C:\Users\Pc\Downloads\webgl_morph_test
npx http-server -p 8888 -o
```

Ouvrir: http://localhost:8888
