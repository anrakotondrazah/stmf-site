"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const onLoad = (): void => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    if (!prefersReducedMotion()) {
      lenis = new Lenis({ lerp: 0.1 });
      lenis.on("scroll", ScrollTrigger.update);
      const instance = lenis;
      tick = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    return () => {
      window.removeEventListener("load", onLoad);
      if (tick) gsap.ticker.remove(tick);
      if (lenis) {
        lenis.destroy();
        gsap.ticker.lagSmoothing(500, 33);
      }
    };
  }, []);

  return <>{children}</>;
}
