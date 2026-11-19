"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/* Easing - Standard */
export const EASE_OUT = "power3.out";
export const EASE_IO = "power2.inOut";
export const EASE_EXPO = "expo.out";

/* Easing - Disney Principles */
export const EASE_SQUASH = "back.out(1.7)";        // Squash & stretch
export const EASE_ANTICIPATE = "power4.out";       // Anticipation wind-up
export const EASE_OVERSHOOT = "back.out(2.0)";     // Follow-through
export const EASE_ELASTIC = "elastic.out(1, 0.3)"; // Appeal/bounce
export const EASE_SNAP = "power4.inOut";           // Snappy timing

/* Durations - Doherty Threshold (<400ms for feedback) */
export const DUR = {
  micro: 0.1,      // Click feedback
  fast: 0.2,       // Hover states
  fade: 0.2,       // Reduced motion fade
  standard: 0.3,   // Page transitions
  doherty: 0.4,    // Max for user feedback
  sequence: 0.7,   // Complex animations
  reveal: 0.8,     // Scroll reveals
} as const;

export const STAGGER = 0.06;
export const STAGGER_FAST = 0.04;

/* Colors - STMF Brand */
export const COLORS = {
  primary: "#1a2744",       // Navy dark
  primaryLight: "#3b82f6",  // Blue
  accent: "#22d3ee",        // Cyan
  secondary: "#60a5fa",     // Blue medium
  mute: "#94a3b8",          // Gray
  gold: "#c9a227",          // Gold accent
} as const;

/* Media queries */
export const MEDIA = {
  full: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;

export interface MotionFlags {
  full: boolean;
  mobile: boolean;
  reduce: boolean;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getMotionFlags(): MotionFlags {
  if (typeof window === "undefined") {
    return { full: false, mobile: false, reduce: true };
  }
  const reduce = window.matchMedia(MEDIA.reduce).matches;
  const full = window.matchMedia(MEDIA.full).matches;
  const mobile = window.matchMedia(MEDIA.mobile).matches;
  return { full, mobile, reduce };
}

export function revealAll(scope: Element, flags: MotionFlags, selector = "[data-reveal]"): void {
  const targets = gsap.utils.toArray<HTMLElement>(selector, scope);
  targets.forEach((el) => {
    gsap.fromTo(
      el,
      { y: flags.reduce ? 0 : 32, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: flags.reduce ? DUR.fade : DUR.standard,
        ease: EASE_OUT,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      }
    );
  });
}
