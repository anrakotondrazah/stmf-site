"use client";

import { useEffect, useCallback, type RefObject } from "react";
import { ScrollTrigger, getMotionFlags, type MotionFlags } from "./motion";

export function useMotion(
  ref: RefObject<HTMLElement | null>,
  setup: (flags: MotionFlags, element: HTMLElement) => void | (() => void)
) {
  const memoizedSetup = useCallback(setup, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const flags = getMotionFlags();
    const cleanup = memoizedSetup(flags, el);

    return () => {
      cleanup?.();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === el || el.contains(st.vars.trigger as Element)) {
          st.kill();
        }
      });
    };
  }, [ref, memoizedSetup]);
}
