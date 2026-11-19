"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowUpRight, ChevronDown } from "lucide-react";

const WebGLMorph = dynamic(() => import("./webgl/WebGLMorph"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-32 h-32 rounded-full bg-primary/20 animate-pulse" />
    </div>
  ),
});

const CHIPS = ["EXPERTISE HUMAINE", "IA & AUTOMATISATION", "TARIFS -60%", "DEPUIS 2016"];

export function Hero() {
  return (
    <section className="relative z-10 min-h-screen flex flex-col justify-center overflow-hidden px-6 pt-32 pb-20">
      {/* WebGL 7-Phase Morph Animation */}
      <WebGLMorph mode="full" enableScroll className="absolute inset-0 z-0" />

      {/* Content - Use CSS animations instead of Reveal for above-the-fold content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Chips */}
        <div className="hero-fade flex flex-wrap gap-2 mb-8" style={{ animationDelay: "0ms" }}>
          {CHIPS.map((chip) => (
            <span
              key={chip}
              className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur text-xs font-medium tracking-[0.15em] hover:bg-white/10 transition-colors"
            >
              {chip}
            </span>
          ))}
        </div>

        {/* Main Title */}
        <h1
          className="hero-fade headline leading-[0.95] mb-6"
          style={{ fontSize: "clamp(2.5rem, 9vw, 6rem)", animationDelay: "100ms" }}
        >
          <span className="block">Externaliser</span>
          <span className="block">vos metiers</span>
          <span className="block text-primary-light">cles</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-fade max-w-2xl text-lg md:text-xl text-white/60 mb-4" style={{ animationDelay: "200ms" }}>
          Votre service client, votre gestion administrative, votre developpement
          commercial, votre back-office technique.
        </p>

        <p className="hero-fade text-sm tracking-[0.3em] text-white/40 mb-10" style={{ animationDelay: "250ms" }}>
          [ DEPUIS 2016 ]
        </p>

        {/* CTA Buttons */}
        <div className="hero-fade flex flex-col sm:flex-row gap-4 mb-16" style={{ animationDelay: "300ms" }}>
          <Link href="/contact" className="btn btn-primary group">
            Demander un devis
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center ml-2 transition-transform group-hover:rotate-45">
              <ArrowUpRight size={16} />
            </span>
          </Link>
          <Link href="/solutions" className="btn btn-outline">
            Voir nos solutions
          </Link>
        </div>

        {/* Tagline */}
        <div className="hero-fade max-w-lg" style={{ animationDelay: "400ms" }}>
          <p className="text-xl md:text-2xl font-light">
            <span className="text-primary-light font-medium">LA FUSION DE L'HUMAIN ET DE L'IA</span>
            <br />
            AU SERVICE DE VOTRE CROISSANCE.
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs tracking-widest text-white/40 animate-bounce">
        <span>DECOUVRIR</span>
        <ChevronDown size={20} />
      </div>
    </section>
  );
}
