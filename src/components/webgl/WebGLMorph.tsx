"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { vertexShader, fragmentShader, bgVertexShader, bgFragmentShader } from "./shaders";
import { prefersReducedMotion } from "@/lib/motion";

const XBOT_URL = "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/models/gltf/Xbot.glb";
const LIN = new Float32Array(256).fill(0).map((_, i) => Math.pow(i / 255, 2.2));

interface WebGLMorphProps {
  mode?: "full" | "wave-only" | "static";
  enableScroll?: boolean;
  className?: string;
}

const TAU = Math.PI * 2;
const BODY_H = 2.7;
const WAVE_WIDTH = 40;
const WAVE_DEPTH = 49;

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

interface QualityTier {
  count: number;
  dpr: number;
  bloom: boolean;
  waveNX: number;
  waveNZ: number;
}

function getQualityTier(): QualityTier {
  if (typeof window === "undefined") {
    return { count: 55000, dpr: 1, bloom: false, waveNX: 300, waveNZ: 140 };
  }

  const isLowPower = navigator.hardwareConcurrency <= 4;
  const isMobile = window.innerWidth < 800;
  const hasReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasSaveData = "connection" in navigator && (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;

  // T3: Static fallback
  if (hasReducedMotion || hasSaveData) {
    return { count: 0, dpr: 1, bloom: false, waveNX: 0, waveNZ: 0 };
  }

  // T2: Mobile/low power - 55k particles, wave grid fits
  if (isMobile || isLowPower) {
    const count = 55000;
    const waveNX = 300;
    const waveNZ = Math.floor(count * 0.76 / waveNX); // ~140
    return { count, dpr: 1, bloom: false, waveNX, waveNZ };
  }

  // T0/T1: Desktop - 110k to match avatar.bin (not 120k to avoid duplication)
  const count = 110000;
  const waveNX = 460;
  const waveNZ = Math.floor(count * 0.76 / waveNX); // ~182
  return { count, dpr: Math.min(window.devicePixelRatio, 1.75), bloom: true, waveNX, waveNZ };
}

function generateSphere(N: number) {
  const pos = new Float32Array(N * 3);
  const nrm = new Float32Array(N * 3);
  const grp = new Float32Array(N);
  const tilt = [[0.35, 0, 0.25], [-0.6, 0, -0.35], [1.1, 0, 0.5]];
  const ringR = [1.5, 1.72, 1.95];
  const e = new THREE.Euler();
  const v = new THREE.Vector3();
  const nv = new THREE.Vector3();

  for (let i = 0; i < N; i++) {
    const r = Math.random();
    let g: number;

    if (r < 0.46) {
      g = 0;
      let phi = Math.random() * TAU;
      let theta = Math.acos(2 * Math.random() - 1);
      const mode = Math.random();
      if (mode < 0.5) {
        const M = 28;
        phi = Math.round(phi / TAU * M) / M * TAU + (Math.random() - 0.5) * 0.01;
      } else if (mode < 0.8) {
        const P = 16;
        theta = clamp(Math.round(theta / Math.PI * P) / P * Math.PI + (Math.random() - 0.5) * 0.008, 0, Math.PI);
      }
      const s = Math.sin(theta);
      nv.set(s * Math.cos(phi), Math.cos(theta), s * Math.sin(phi));
      v.copy(nv).multiplyScalar(1.1 * (1 + (Math.random() - 0.5) * 0.012));
    } else if (r < 0.68) {
      g = 1;
      nv.randomDirection();
      v.copy(nv).multiplyScalar(0.62 * Math.pow(Math.random(), 0.65));
    } else if (r < 0.88) {
      const k = Math.floor(Math.random() * 3);
      g = 2 + k;
      let a = Math.random() * TAU;
      let rad = ringR[k] + (Math.random() - 0.5) * 0.02;
      const y = (Math.random() - 0.5) * 0.02;
      if (Math.random() < 0.22) {
        a = Math.round(a / TAU * 90) / 90 * TAU;
        rad += Math.random() * 0.07;
      }
      nv.set(Math.cos(a), 0, Math.sin(a));
      v.set(nv.x * rad, y, nv.z * rad);
      e.set(tilt[k][0], tilt[k][1], tilt[k][2]);
      v.applyEuler(e);
      nv.applyEuler(e);
    } else {
      g = 5;
      nv.randomDirection();
      v.copy(nv).multiplyScalar(1.25 + Math.pow(Math.random(), 1.8) * 1.4);
    }

    pos.set([v.x, v.y, v.z], i * 3);
    nrm.set([nv.x, nv.y, nv.z], i * 3);
    grp[i] = g;
  }
  return { pos, nrm, grp };
}

function generateWave(N: number, waveNX: number, waveNZ: number) {
  const pos = new Float32Array(N * 3);
  const nrm = new Float32Array(N * 3);
  const grid = new Float32Array(N * 2);
  const v = new THREE.Vector3();
  const waveCount = waveNX * waveNZ;

  for (let i = 0; i < N; i++) {
    if (i < waveCount) {
      const ix = i % waveNX;
      const iz = Math.floor(i / waveNX);
      const u = ix / (waveNX - 1);
      const w = iz / (waveNZ - 1);
      const x = (u - 0.5) * WAVE_WIDTH + (Math.random() - 0.5) * 0.08;
      const z = w * -WAVE_DEPTH + 4 + (Math.random() - 0.5) * 0.1;
      const y = -1.5 + (Math.random() - 0.5) * 0.05;
      v.set(x, y, z);
      grid[i * 2] = u;
      grid[i * 2 + 1] = w;
    } else {
      v.set(
        (Math.random() - 0.5) * WAVE_WIDTH * 1.5,
        Math.random() * 8 - 3,
        Math.random() * -WAVE_DEPTH
      );
      grid[i * 2] = -1; // Dust particle marker
      grid[i * 2 + 1] = Math.random();
    }
    pos.set([v.x, v.y, v.z], i * 3);
    nrm.set([0, 1, 0], i * 3);
  }
  return { pos, nrm, grid };
}

function humanParts() {
  const P: Array<{ k: string; c?: number[]; r?: number[]; a?: number[]; b?: number[]; ra?: number; rb?: number; w: number; tag?: number }> = [];
  const E = (c: number[], r: number[], w = 1, tag = 0) => P.push({ k: "e", c, r, w, tag });
  const C = (a: number[], b: number[], ra: number, rb: number, w = 1, tag = 0) => P.push({ k: "c", a, b, ra, rb, w, tag });

  E([0, 1.68, 0], [0.095, 0.12, 0.105], 2.6);
  C([0, 1.58, 0], [0, 1.47, 0], 0.048, 0.055);
  E([0, 1.33, 0], [0.18, 0.2, 0.105], 1.2);
  C([0, 1.22, 0], [0, 0.99, 0], 0.14, 0.15);
  E([0, 0.95, 0], [0.165, 0.12, 0.11]);

  for (const s of [-1, 1]) {
    E([s * 0.2, 1.46, 0], [0.065, 0.065, 0.065]);
    C([s * 0.215, 1.44, 0], [s * 0.27, 1.16, 0.01], 0.052, 0.042, 1.1);
    C([s * 0.27, 1.16, 0.01], [s * 0.31, 0.9, 0.05], 0.042, 0.03, 1.1);
    E([s * 0.315, 0.84, 0.055], [0.032, 0.06, 0.02], 1.5);
    C([s * 0.09, 0.92, 0], [s * 0.1, 0.5, 0.01], 0.085, 0.058);
    C([s * 0.1, 0.5, 0.01], [s * 0.1, 0.1, 0], 0.056, 0.038);
    E([s * 0.1, 0.045, 0.05], [0.04, 0.035, 0.1], 1.2);
  }
  return P;
}

function robotParts() {
  const P: Array<{ k: string; c?: number[]; r?: number[]; a?: number[]; b?: number[]; ra?: number; rb?: number; w: number; tag?: number }> = [];
  const E = (c: number[], r: number[], w = 1, tag = 0) => P.push({ k: "e", c, r, w, tag });
  const C = (a: number[], b: number[], ra: number, rb: number, w = 1, tag = 0) => P.push({ k: "c", a, b, ra, rb, w, tag });

  E([0, 1.68, 0], [0.1, 0.125, 0.11], 2.4);
  E([0, 1.68, 0.07], [0.085, 0.028, 0.05], 1.6, 1);
  C([0, 1.57, 0], [0, 1.47, 0], 0.035, 0.04, 1, 1);
  E([0, 1.33, 0], [0.21, 0.21, 0.13], 1.4);
  E([0, 1.34, 0.125], [0.045, 0.045, 0.02], 2, 1);
  C([0, 1.2, 0], [0, 1.0, 0], 0.09, 0.1);
  E([0, 0.95, 0], [0.15, 0.11, 0.11]);

  for (const s of [-1, 1]) {
    E([s * 0.25, 1.45, 0], [0.09, 0.08, 0.08], 1.3);
    E([s * 0.27, 1.2, 0.01], [0.04, 0.04, 0.04], 1.4, 1);
    C([s * 0.26, 1.42, 0], [s * 0.27, 1.2, 0.01], 0.045, 0.038);
    C([s * 0.27, 1.2, 0.01], [s * 0.3, 0.92, 0.04], 0.04, 0.03);
    E([s * 0.305, 0.85, 0.05], [0.035, 0.065, 0.025], 1.4);
    E([s * 0.1, 0.5, 0.01], [0.055, 0.055, 0.055], 1.4, 1);
    C([s * 0.09, 0.9, 0], [s * 0.1, 0.5, 0.01], 0.07, 0.052);
    C([s * 0.1, 0.5, 0.01], [s * 0.1, 0.1, 0], 0.05, 0.036);
    E([s * 0.1, 0.045, 0.05], [0.045, 0.035, 0.105], 1.2);
  }
  return P;
}

type PartType = ReturnType<typeof humanParts>[0] & { len?: number; d?: number[]; u?: THREE.Vector3; v?: THREE.Vector3 };

function shapeFromParts(parts: PartType[], N: number, skin: number[]) {
  let tot = 0;
  const cum = parts.map((p) => {
    if (p.k === "c" && p.a && p.b) {
      const d = [p.b[0] - p.a[0], p.b[1] - p.a[1], p.b[2] - p.a[2]];
      p.len = Math.hypot(...d);
      p.d = d;
      const ax = new THREE.Vector3(...d).normalize();
      const h = Math.abs(ax.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
      p.u = new THREE.Vector3().crossVectors(ax, h).normalize();
      p.v = new THREE.Vector3().crossVectors(ax, p.u!).normalize();
    }
    const area = p.k === "c" && p.len && p.ra && p.rb
      ? p.len * Math.PI * (p.ra + p.rb)
      : p.r ? 4 * Math.PI * ((p.r[0] * p.r[1] + p.r[1] * p.r[2] + p.r[0] * p.r[2]) / 3) : 1;
    return (tot += area * p.w);
  });

  const out = {
    pos: new Float32Array(N * 3),
    nrm: new Float32Array(N * 3),
    col: new Float32Array(N * 3),
    part: new Float32Array(N),
  };
  const s = new THREE.Vector3();
  const n = new THREE.Vector3();

  for (let i = 0; i < N; i++) {
    const x = Math.random() * tot;
    let j = cum.findIndex((c) => c >= x);
    if (j < 0) j = parts.length - 1;
    const p = parts[j];
    let px: number, py: number, pz: number;

    if (p.k === "c" && p.a && p.d && p.ra && p.rb && p.u && p.v) {
      const t = Math.random();
      const a = Math.random() * TAU;
      const rad = p.ra + (p.rb - p.ra) * t;
      n.copy(p.u).multiplyScalar(Math.cos(a)).addScaledVector(p.v, Math.sin(a));
      px = p.a[0] + p.d[0] * t + n.x * rad;
      py = p.a[1] + p.d[1] * t + n.y * rad;
      pz = p.a[2] + p.d[2] * t + n.z * rad;
    } else if (p.c && p.r) {
      s.randomDirection();
      px = p.c[0] + s.x * p.r[0];
      py = p.c[1] + s.y * p.r[1];
      pz = p.c[2] + s.z * p.r[2];
      n.set(s.x / p.r[0], s.y / p.r[1], s.z / p.r[2]).normalize();
    } else {
      px = py = pz = 0;
    }

    out.pos.set([px, py, pz], i * 3);
    out.nrm.set([n.x, n.y, n.z], i * 3);
    out.col.set(skin, i * 3);
    out.part[i] = p.tag || 0;
  }
  return out;
}

function bounds(pos: Float32Array) {
  const mn = [Infinity, Infinity, Infinity];
  const mx = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < pos.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      const v = pos[i + k];
      if (v < mn[k]) mn[k] = v;
      if (v > mx[k]) mx[k] = v;
    }
  }
  return { min: mn, max: mx };
}

function finalizeShape<T extends { pos: Float32Array }>(s: T, targetH = BODY_H): T {
  const b = bounds(s.pos);
  const h = b.max[1] - b.min[1];
  const sc = targetH / h;
  const cx = (b.min[0] + b.max[0]) / 2;
  const cz = (b.min[2] + b.max[2]) / 2;

  for (let i = 0; i < s.pos.length; i += 3) {
    s.pos[i] = (s.pos[i] - cx) * sc;
    s.pos[i + 1] = (s.pos[i + 1] - b.min[1]) * sc - targetH / 2;
    s.pos[i + 2] = (s.pos[i + 2] - cz) * sc;
  }
  return s;
}

function sortShape<T extends Record<string, Float32Array>>(s: T, N: number): T {
  const keys = new Float32Array(N);
  for (let i = 0; i < N; i++) keys[i] = s.pos[i * 3 + 1] + (Math.random() - 0.5) * 0.5;
  const order = new Uint32Array(N);
  for (let i = 0; i < N; i++) order[i] = i;
  order.sort((a, b) => keys[a] - keys[b]);

  for (const k of Object.keys(s)) {
    const src = s[k];
    const st = src.length / N;
    const dst = new Float32Array(src.length);
    for (let i = 0; i < N; i++) {
      const o = order[i];
      for (let j = 0; j < st; j++) dst[i * st + j] = src[o * st + j];
    }
    (s as Record<string, Float32Array>)[k] = dst;
  }
  return s;
}

async function loadBaked(url: string, N: number) {
  const buf = await (await fetch(url)).arrayBuffer();
  const view = new DataView(buf);
  const M = view.getUint32(0, true);
  const n = Math.min(N, M);
  const pos = new Float32Array(buf, 8, M * 3);
  const nr = new Int8Array(buf, 8 + M * 12, M * 3);
  const cl = new Uint8Array(buf, 8 + M * 15, M * 3);
  const tg = new Uint8Array(buf, 8 + M * 18, M);
  const out = {
    pos: new Float32Array(N * 3),
    nrm: new Float32Array(N * 3),
    col: new Float32Array(N * 3),
    part: new Float32Array(N),
  };
  for (let i = 0; i < N; i++) {
    const j = i % n;
    for (let k = 0; k < 3; k++) {
      out.pos[i * 3 + k] = pos[j * 3 + k];
      out.nrm[i * 3 + k] = nr[j * 3 + k] / 127;
      out.col[i * 3 + k] = LIN[cl[j * 3 + k]];
    }
    out.part[i] = tg[j];
  }
  return out;
}

function meshArea(mesh: THREE.Mesh): number {
  const g = mesh.geometry;
  const p = g.attributes.position;
  const idx = g.index;
  const sc = Math.cbrt(Math.abs(mesh.matrixWorld.determinant()));
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const tri = idx ? idx.count / 3 : p.count / 3;
  let area = 0;
  for (let i = 0; i < tri; i++) {
    const i0 = idx ? idx.getX(i * 3) : i * 3;
    const i1 = idx ? idx.getX(i * 3 + 1) : i * 3 + 1;
    const i2 = idx ? idx.getX(i * 3 + 2) : i * 3 + 2;
    a.fromBufferAttribute(p, i0);
    b.fromBufferAttribute(p, i1);
    c.fromBufferAttribute(p, i2);
    area += b.sub(a).cross(c.sub(a)).length() * 0.5;
  }
  return area * sc * sc;
}

async function shapeFromGLB(url: string, N: number) {
  const gltfLoader = new GLTFLoader();
  const gltf = await gltfLoader.loadAsync(url);
  gltf.scene.updateMatrixWorld(true);

  const items: Array<{
    mesh: THREE.Mesh;
    sampler: MeshSurfaceSampler;
    color: THREE.Color;
    tag: number;
    cum: number;
  }> = [];
  let total = 0;

  gltf.scene.traverse((o) => {
    if (!(o as THREE.Mesh).isMesh) return;
    const mesh = o as THREE.Mesh;
    if (!mesh.visible || !mesh.geometry.attributes.position) return;
    const area = meshArea(mesh);
    if (!(area > 0)) return;
    const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    const matColor = (mat as THREE.MeshStandardMaterial)?.color;
    items.push({
      mesh,
      sampler: new MeshSurfaceSampler(mesh).build(),
      color: matColor ? matColor : new THREE.Color(0.7, 0.6, 0.5),
      tag: /joint|eye|lens|light/i.test(mesh.name + " " + ((mat as THREE.Material)?.name || "")) ? 1 : 0,
      cum: (total += area),
    });
  });

  if (!items.length) throw new Error("Model has no mesh");

  const out = {
    pos: new Float32Array(N * 3),
    nrm: new Float32Array(N * 3),
    col: new Float32Array(N * 3),
    part: new Float32Array(N),
  };
  const P = new THREE.Vector3(), Nm = new THREE.Vector3();

  for (let i = 0; i < N; i++) {
    const r = Math.random() * total;
    let it = items[items.length - 1];
    for (const c of items) if (c.cum >= r) { it = c; break; }
    it.sampler.sample(P, Nm);
    P.applyMatrix4(it.mesh.matrixWorld);
    Nm.transformDirection(it.mesh.matrixWorld);
    out.pos[i * 3] = P.x;
    out.pos[i * 3 + 1] = P.y;
    out.pos[i * 3 + 2] = P.z;
    out.nrm[i * 3] = Nm.x;
    out.nrm[i * 3 + 1] = Nm.y;
    out.nrm[i * 3 + 2] = Nm.z;
    out.col[i * 3] = it.color.r;
    out.col[i * 3 + 1] = it.color.g;
    out.col[i * 3 + 2] = it.color.b;
    out.part[i] = it.tag;
  }
  return finalizeShape(out);
}

export default function WebGLMorph({
  mode = "full",
  enableScroll = true,
  className = "",
}: WebGLMorphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const clockRef = useRef<THREE.Clock | null>(null);

  const init = useCallback(() => {
    if (!containerRef.current) return null;

    const tier = getQualityTier();
    if (tier.count === 0) return null; // T3: static fallback

    const COUNT = tier.count;
    const VAGABOND_COUNT = Math.floor(COUNT * 0.12);
    const PR = tier.dpr;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(PR);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.88;
    containerRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);

    const bgU = { uTime: { value: 0 } };
    const bgMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: bgU,
        depthTest: false,
        depthWrite: false,
        vertexShader: bgVertexShader,
        fragmentShader: bgFragmentShader,
      })
    );
    bgMesh.frustumCulled = false;
    bgMesh.renderOrder = -10;
    scene.add(bgMesh);

    const starPos = new Float32Array(900 * 3);
    for (let i = 0; i < 900; i++) {
      starPos.set(
        [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 17, -3 - Math.random() * 9],
        i * 3
      );
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    scene.add(
      new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({
          color: 0x9db8ff,
          size: 1.5,
          sizeAttenuation: false,
          transparent: true,
          opacity: 0.5,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      )
    );

    const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6.5;

    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(PR);
    composer.setSize(window.innerWidth, window.innerHeight);
    composer.addPass(new RenderPass(scene, camera));

    // Conditional bloom based on quality tier
    if (tier.bloom) {
      const bloomRes = new THREE.Vector2(
        Math.floor(window.innerWidth / 2),
        Math.floor(window.innerHeight / 2)
      );
      const bloom = new UnrealBloomPass(bloomRes, 0.34, 0.5, 0.68);
      composer.addPass(bloom);
    }
    composer.addPass(new OutputPass());

    const sphere = sortShape(generateSphere(COUNT), COUNT);
    // Fallback procedural shapes (will be replaced when models load)
    const humanFallback = sortShape(
      finalizeShape(shapeFromParts(humanParts() as PartType[], COUNT, [0.62, 0.36, 0.28])),
      COUNT
    );
    const robotFallback = sortShape(
      finalizeShape(shapeFromParts(robotParts() as PartType[], COUNT, [0.6, 0.7, 0.8])),
      COUNT
    );
    const wave = generateWave(COUNT, tier.waveNX, tier.waveNZ);

    const vagabondPos = new Float32Array(COUNT * 3);
    const vagabondVel = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      vagabondPos[i * 3] = (Math.random() - 0.5) * 20;
      vagabondPos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      vagabondPos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      vagabondVel[i * 3] = (Math.random() - 0.5) * 0.02;
      vagabondVel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vagabondVel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    const rand = new Float32Array(COUNT * 4);
    for (let i = 0; i < rand.length; i++) rand[i] = Math.random();

    const geometry = new THREE.BufferGeometry();
    const A = (name: string, arr: Float32Array, size: number) =>
      geometry.setAttribute(name, new THREE.BufferAttribute(arr, size));
    const setAttr = (name: string, arr: Float32Array) => {
      const a = geometry.attributes[name] as THREE.BufferAttribute;
      a.array.set(arr);
      a.needsUpdate = true;
    };

    A("position", sphere.pos, 3);
    A("normal", sphere.nrm, 3);
    A("aGroup", sphere.grp, 1);
    A("aHuman", humanFallback.pos, 3);
    A("nHuman", humanFallback.nrm, 3);
    A("aCol", humanFallback.col, 3);
    A("aHPart", humanFallback.part, 1);
    A("aRobot", robotFallback.pos, 3);
    A("nRobot", robotFallback.nrm, 3);
    A("aRPart", robotFallback.part, 1);
    A("aWave", wave.pos, 3);
    A("aWaveGrid", wave.grid, 2);
    A("aVagabond", vagabondPos, 3);
    A("aVagabondVel", vagabondVel, 3);
    A("aRand", rand, 4);

    // Load real models asynchronously (avatar.bin for human, Xbot.glb for robot)
    loadBaked("/avatar.bin", COUNT)
      .then((s) => {
        sortShape(s, COUNT);
        setAttr("aHuman", s.pos);
        setAttr("nHuman", s.nrm);
        setAttr("aCol", s.col);
        setAttr("aHPart", s.part);
        console.log("Avatar loaded:", COUNT, "particles");
      })
      .catch((err) => console.warn("Avatar fallback:", err));

    shapeFromGLB(XBOT_URL, COUNT)
      .then((s) => {
        sortShape(s, COUNT);
        setAttr("aRobot", s.pos);
        setAttr("nRobot", s.nrm);
        setAttr("aRPart", s.part);
        console.log("Robot loaded:", COUNT, "particles");
      })
      .catch((err) => console.warn("Robot fallback:", err));

    const uniforms = {
      uTime: { value: 0 },
      uMorph: { value: mode === "wave-only" ? 3 : 0 },
      uPixelRatio: { value: PR },
      uSize: { value: 1.75 },
      uGain: { value: 0.7 },
      uBurst: { value: 1.0 },
      uPointer: { value: new THREE.Vector3(99, 99, 0) },
      uPointerForce: { value: 0 },
      uWaveWidth: { value: WAVE_WIDTH },
      uWaveDepth: { value: WAVE_DEPTH },
      uVagabondMix: { value: 0.3 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    const group = new THREE.Group();
    group.add(points);
    scene.add(group);

    return {
      renderer,
      scene,
      camera,
      composer,
      uniforms,
      bgU,
      group,
      COUNT,
      VAGABOND_COUNT,
      tier,
    };
  }, [mode]);

  useEffect(() => {
    const ctx = init();
    if (!ctx) return;

    const { renderer, camera, composer, uniforms, bgU, group } = ctx;
    clockRef.current = new THREE.Clock();

    let sCur = 0;
    const ndc = new THREE.Vector2(0, 0);
    const mouse = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hit = new THREE.Vector3();
    let pointerActive = false;
    let isVisible = true;
    let lastInteraction = Date.now();
    let cachedMaxScroll = 1;

    const SECTIONS = 7;

    // Cache maxScroll with ResizeObserver
    const updateMaxScroll = () => {
      cachedMaxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    updateMaxScroll();
    const resizeObserver = new ResizeObserver(updateMaxScroll);
    resizeObserver.observe(document.body);

    // Pause when not visible (IntersectionObserver + document.hidden)
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) {
      intersectionObserver.observe(containerRef.current);
    }

    const morphFromS = (s: number) => {
      if (s <= 0.5) return 0;
      if (s <= 1.5) return s - 0.5;
      if (s <= 2.5) return 1;
      if (s <= 3.5) return 1 + (s - 2.5);
      if (s <= 4.5) return 2;
      if (s <= 5.5) return 2 + (s - 4.5);
      return 3;
    };

    const handlePointerMove = (e: PointerEvent) => {
      ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
      ndc.y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerActive = true;
      lastInteraction = Date.now();
    };

    const handleScroll = () => {
      lastInteraction = Date.now();
    };

    const handlePointerLeave = () => {
      pointerActive = false;
    };

    const handleResize = () => {
      const aspect = window.innerWidth / window.innerHeight;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);

      group.position.x = aspect > 1.2 ? 1.25 : 0;
      group.position.y = aspect < 0.8 ? 0.6 : 0;
      group.scale.setScalar(aspect < 0.8 ? 0.72 : 1);
    };

    window.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", handleResize);
    handleResize();

    let frameCount = 0;
    const frame = () => {
      rafRef.current = requestAnimationFrame(frame);
      const clock = clockRef.current;
      if (!clock) return;

      // Skip frames when not visible (0 GPU when hidden)
      if (!isVisible) return;

      // Reduce to 30fps after 10s of inactivity
      const idleTime = Date.now() - lastInteraction;
      if (idleTime > 10000) {
        frameCount++;
        if (frameCount % 2 !== 0) return; // Skip every other frame
      } else {
        frameCount = 0;
      }

      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      if (enableScroll && mode === "full") {
        const sTarget = clamp(window.scrollY / cachedMaxScroll, 0, 1) * (SECTIONS - 1);
        const scrollingUp = sTarget < sCur;
        const smoothFactor = scrollingUp ? 3.5 : 6;
        sCur += (sTarget - sCur) * (1 - Math.exp(-dt * smoothFactor));
        uniforms.uMorph.value = morphFromS(sCur);
      }

      uniforms.uTime.value = t;
      bgU.uTime.value = t;

      const morphValue = uniforms.uMorph.value;
      const inTransition = (morphValue % 1) > 0.1 && (morphValue % 1) < 0.9;
      const targetVagabond = inTransition ? 0.0 : 0.3;
      uniforms.uVagabondMix.value += (targetVagabond - uniforms.uVagabondMix.value) * dt * 3;

      const waveBlend = smooth(2.3, 2.8, morphValue);
      const aspect = window.innerWidth / window.innerHeight;
      const mobileOffsetY = aspect < 0.8 ? 0.6 : 0;
      const baseScale = aspect < 0.8 ? 0.72 : 1;

      const defaultCamZ = 6.5;
      const waveCamX = mouse.x * 1.8;
      const waveCamY = 2.5 - mouse.y * 0.6;
      const waveCamZ = 8.5;
      const waveGroupY = mobileOffsetY - 1.5;

      camera.fov = 38 + waveBlend * 4;
      camera.updateProjectionMatrix();

      camera.position.x = waveCamX * waveBlend;
      camera.position.y = waveCamY * waveBlend;
      camera.position.z = defaultCamZ + (waveCamZ - defaultCamZ) * waveBlend;

      group.position.x = (aspect > 1.2 ? 1.25 : 0) * (1 - waveBlend);
      group.position.y = mobileOffsetY + (waveGroupY - mobileOffsetY) * waveBlend;
      group.scale.setScalar(baseScale * (1 + waveBlend * 0.5));

      if (waveBlend > 0.01) {
        camera.lookAt(0, -0.5 * waveBlend, -8 * waveBlend);
      }

      mouse.x += (ndc.x - mouse.x) * (1 - Math.exp(-dt * 3));
      mouse.y += (ndc.y - mouse.y) * (1 - Math.exp(-dt * 3));

      const rotScale = 1 - waveBlend * 0.7;
      group.rotation.y = (mouse.x * 0.35 + Math.sin(t * 0.3) * 0.12) * rotScale;
      group.rotation.x = -mouse.y * 0.15 * rotScale;

      group.updateMatrixWorld();
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        group.worldToLocal(hit);
        uniforms.uPointer.value.copy(hit);
      }
      uniforms.uPointerForce.value +=
        ((pointerActive ? 1 : 0) - uniforms.uPointerForce.value) * (1 - Math.exp(-dt * 5));

      composer.render();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    frame();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [init, mode, enableScroll]);

  if (prefersReducedMotion()) {
    return (
      <div
        className={`fixed inset-0 -z-10 bg-gradient-to-b from-[#0f172a] to-[#1a2744] ${className}`}
        style={{ zIndex: -1 }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 -z-10 ${className}`}
      style={{ zIndex: -1 }}
      aria-hidden="true"
    />
  );
}
