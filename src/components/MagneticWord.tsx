"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface MagneticWordProps {
  text: string;
  suffix?: ReactNode;
  radius?: number;
  maxPull?: number;
  stepMs?: number;
}

const IDLE_MS = 1200;
const LERP = 0.12;

export function MagneticWord({
  text,
  suffix,
  radius = 140,
  maxPull = 18,
  stepMs = 80,
}: MagneticWordProps) {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLSpanElement>(null);
  const outerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const innerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const letters = Array.from(text);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (reduced) {
      innerRefs.current.forEach((el) => {
        if (el) el.style.transform = "";
      });
      return;
    }

    const count = letters.length;
    let centres: { x: number; y: number }[] = [];
    const current = Array.from({ length: count }, () => ({ x: 0, y: 0 }));
    const pointerRef = { current: null as { x: number; y: number } | null };
    let lastEvent = -Infinity;
    let size = { w: 0, h: 0 };
    let raf = 0;
    const start = performance.now();

    const measure = () => {
      size = { w: container.offsetWidth, h: container.offsetHeight };
      centres = outerRefs.current.map((el) =>
        el
          ? { x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight / 2 }
          : { x: 0, y: 0 }
      );
    };

    const setPointer = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      pointerRef.current = { x: clientX - rect.left, y: clientY - rect.top };
      lastEvent = performance.now();
    };

    const onMouseMove = (e: MouseEvent) => setPointer(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) setPointer(t.clientX, t.clientY);
    };
    const onLeave = () => {
      pointerRef.current = null;
    };

    const tick = (now: number) => {
      let active: { x: number; y: number } | null = null;
      if (pointerRef.current && now - lastEvent < IDLE_MS) {
        active = pointerRef.current;
      } else {
        const t = (now - start) / 1000;
        active = {
          x: size.w * (0.5 + 0.42 * Math.sin(t * 0.7)),
          y: size.h * (0.5 + 0.22 * Math.sin(t * 1.3)),
        };
      }

      for (let i = 0; i < count; i++) {
        const el = innerRefs.current[i];
        const c = centres[i];
        if (!el || !c) continue;
        let tx = 0;
        let ty = 0;
        const dx = active.x - c.x;
        const dy = active.y - c.y;
        const dist = Math.hypot(dx, dy);
        if (dist < radius && dist > 0.001) {
          const mag = Math.min(maxPull, ((radius - dist) / radius) * maxPull);
          tx = (dx / dist) * mag;
          ty = (dy / dist) * mag;
        }
        const cur = current[i];
        cur.x += (tx - cur.x) * LERP;
        cur.y += (ty - cur.y) * LERP;
        el.style.transform = `translate3d(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);

    if (document.fonts?.ready) document.fonts.ready.then(measure);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [reduced, text, radius, maxPull, letters.length]);

  return (
    <span ref={containerRef} className="relative inline-block" aria-hidden="true">
      {letters.map((ch, i) => (
        <span
          key={i}
          ref={(el) => { outerRefs.current[i] = el; }}
          className="anim-letter relative inline-block"
          style={{ animationDelay: `${i * stepMs}ms` }}
          aria-hidden="true"
        >
          <span
            ref={(el) => { innerRefs.current[i] = el; }}
            className="inline-block will-change-transform"
            aria-hidden="true"
          >
            {ch === " " ? " " : ch}
          </span>
          {i === letters.length - 1 && suffix}
        </span>
      ))}
    </span>
  );
}
