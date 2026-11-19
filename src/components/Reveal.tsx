"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useReveal } from "@/hooks/useReveal";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const { ref, shown } = useReveal();

  return (
    <div
      ref={ref}
      className={cn("reveal", shown && "in", className)}
      style={{ ["--d" as string]: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}
