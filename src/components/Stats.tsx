"use client";

import { useEffect, useRef, useState } from "react";

interface StatProps {
  value: number;
  suffix?: string;
  label: string;
}

function AnimatedStat({ value, suffix = "", label }: StatProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl md:text-6xl font-bold text-primary-light">
        {count}
        <span className="text-3xl">{suffix}</span>
      </div>
      <div className="text-sm text-mute mt-2">{label}</div>
    </div>
  );
}

const STATS = [
  { value: 8, suffix: "", label: "Annees d'experience" },
  { value: 50, suffix: "+", label: "Collaborateurs" },
  { value: 100, suffix: "+", label: "Clients satisfaits" },
  { value: 60, suffix: "%", label: "Economies realisees" },
];

export function Stats() {
  return (
    <section className="relative py-16 px-6 bg-card border-y border-line">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <AnimatedStat key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
