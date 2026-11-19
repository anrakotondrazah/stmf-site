"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.); const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.; vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const VERT = /* glsl */ `
uniform float uTime, uAmp, uFreq, uSize, uPixelRatio, uRadius, uHover;
uniform vec3 uMouse;
attribute float aRand;
varying float vNoise, vFacing, vHover;
${NOISE}
void main(){
  vec3 dir = normalize(position);
  float n = snoise(dir * uFreq + vec3(0., uTime * 0.25, uTime * 0.1));
  float hover = smoothstep(0.65, 0.0, distance(dir, uMouse)) * uHover;
  float disp = n * uAmp + hover * 0.14;
  vec4 mv = modelViewMatrix * vec4(dir * (uRadius + disp), 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.6 + aRand * 0.8) / -mv.z;
  vNoise = n;
  vHover = hover;
  vFacing = normalize(normalMatrix * dir).z;
}`;

const FRAG = /* glsl */ `
uniform float uOpacity;
varying float vNoise, vFacing, vHover;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = pow(smoothstep(0.5, 0.0, d), 2.0);
  float rim = pow(1.0 - abs(vFacing), 1.6);
  float back = vFacing < 0.0 ? 0.45 : 1.0;
  vec3 deep = vec3(0.0, 0.35, 0.5);
  vec3 cyan = vec3(0.1, 0.85, 1.0);
  vec3 col = mix(deep, cyan, clamp(rim + 0.2, 0.0, 1.0));
  col = mix(col, vec3(1.0), clamp(smoothstep(0.3, 0.9, vNoise) * 0.8 + vHover * 0.6, 0.0, 1.0));
  gl_FragColor = vec4(col, a * back * (0.25 + rim * 0.9) * uOpacity);
}`;

export default function ParticleSphere({ count = 22000 }: { count?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(dpr);
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.z = 4.2;

    // Sphere de Fibonacci (repartition uniforme)
    const pos = new Float32Array(count * 3);
    const rnd = new Float32Array(count);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      pos.set([Math.cos(t) * r, y, Math.sin(t) * r], i * 3);
      rnd[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aRand", new THREE.BufferAttribute(rnd, 1));

    const uniforms = {
      uTime: { value: 0 }, uAmp: { value: 0.18 }, uFreq: { value: 1.4 },
      uSize: { value: 14 }, uPixelRatio: { value: dpr }, uRadius: { value: 1 },
      uHover: { value: 0 }, uMouse: { value: new THREE.Vector3(0, 0, 1) },
      uOpacity: { value: 1 },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms, vertexShader: VERT, fragmentShader: FRAG,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });

    const tilt = new THREE.Group();
    const spin = new THREE.Group();
    spin.add(new THREE.Points(geo, mat));
    tilt.add(spin);
    scene.add(tilt);

    // Particules satellites
    const sc = 160;
    const sp = new Float32Array(sc * 3);
    for (let i = 0; i < sc; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(1.4 + Math.random() * 1.1);
      sp.set([v.x, v.y, v.z], i * 3);
    }
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
    const sMat = new THREE.PointsMaterial({
      size: 0.025, color: 0x6fe8ff, transparent: true, opacity: 0.6,
      depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const sats = new THREE.Points(sGeo, sMat);
    tilt.add(sats);

    // Interaction
    const ndc = new THREE.Vector2(0, 0);
    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    };
    window.addEventListener("mousemove", onMove);

    const ray = new THREE.Raycaster();
    const hitSphere = new THREE.Sphere();
    const hit = new THREE.Vector3();
    const clock = new THREE.Clock();
    let time = 0, vel = 0, lastY = window.scrollY, raf = 0;

    const onResize = () => {
      renderer.setSize(el.clientWidth, el.clientHeight);
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      if (reduce) renderer.render(scene, camera);
    };
    window.addEventListener("resize", onResize);

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(clock.getDelta(), 0.05);
      time += dt;
      const k = 1 - Math.exp(-dt * 5);

      // Scroll : vitesse lissee + progression sur la hauteur du hero
      const y = window.scrollY;
      vel += ((y - lastY) / Math.max(dt, 0.001) - vel) * 0.08;
      lastY = y;
      const speed = Math.min(Math.abs(vel) / 2000, 1);
      const p = Math.min(y / window.innerHeight, 1);

      // Souris : inclinaison amortie
      mouse.x += (ndc.x - mouse.x) * k;
      mouse.y += (ndc.y - mouse.y) * k;
      tilt.rotation.y = mouse.x * 0.4;
      tilt.rotation.x = -mouse.y * 0.3;

      // Repos + scroll
      spin.rotation.y += dt * (0.12 + speed * 1.6);
      spin.rotation.x = Math.sin(time * 0.2) * 0.15;
      sats.rotation.y -= dt * 0.05;
      sats.position.y = Math.sin(time * 0.5) * 0.08;
      tilt.scale.setScalar(1 + p * 0.7);
      tilt.position.x = p * 1.2;
      uniforms.uOpacity.value = 1 - p * 0.75;
      uniforms.uAmp.value = 0.18 + speed * 0.22;
      uniforms.uTime.value = time;

      // Hover : raycast sur la sphere, point converti en repere local
      ray.setFromCamera(ndc, camera);
      hitSphere.set(tilt.position, tilt.scale.x);
      const hasHit = ray.ray.intersectSphere(hitSphere, hit) !== null;
      if (hasHit) {
        spin.updateWorldMatrix(true, false);
        uniforms.uMouse.value.copy(spin.worldToLocal(hit)).normalize();
      }
      uniforms.uHover.value += ((hasHit ? 1 : 0) - uniforms.uHover.value) * k;

      renderer.render(scene, camera);
    };

    if (reduce) renderer.render(scene, camera);
    else loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      geo.dispose(); mat.dispose(); sGeo.dispose(); sMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [count]);

  return <div ref={ref} className="pointer-events-none absolute inset-0 z-0" />;
}
