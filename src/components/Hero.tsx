"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Reveal } from "./Reveal";

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
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden px-6 pt-32 pb-20">
      {/* WebGL 7-Phase Morph Animation */}
      <WebGLMorph mode="full" enableScroll className="absolute inset-0 z-0" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Chips */}
        <Reveal>
          <div className="flex flex-wrap gap-2 mb-8">
            {CHIPS.map((chip) => (
              <span
                key={chip}
                className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur text-xs font-medium tracking-[0.15em] hover:bg-white/10 transition-colors"
              >
                {chip}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Main Title */}
        <Reveal delay={100}>
          <h1
            className="headline leading-[0.95] mb-6"
            style={{ fontSize: "clamp(2.5rem, 9vw, 6rem)" }}
          >
            <span className="block">Externaliser</span>
            <span className="block">vos metiers</span>
            <span className="block text-primary-light">cles</span>
          </h1>
        </Reveal>

        {/* Subtitle */}
        <Reveal delay={200}>
          <p className="max-w-2xl text-lg md:text-xl text-white/60 mb-4">
            Votre service client, votre gestion administrative, votre developpement
            commercial, votre back-office technique.
          </p>
        </Reveal>

        <Reveal delay={250}>
          <p className="text-sm tracking-[0.3em] text-white/40 mb-10">[ DEPUIS 2016 ]</p>
        </Reveal>

        {/* CTA Buttons */}
        <Reveal delay={300} className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link href="/contact" className="btn btn-primary group">
            Demander un devis
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center ml-2 transition-transform group-hover:rotate-45">
              <ArrowUpRight size={16} />
            </span>
          </Link>
          <Link href="/solutions" className="btn btn-outline">
            Voir nos solutions
          </Link>
        </Reveal>

        {/* Tagline */}
        <Reveal delay={400}>
          <div className="max-w-lg">
            <p className="text-xl md:text-2xl font-light">
              <span className="text-primary-light font-medium">LA FUSION DE L'HUMAIN ET DE L'IA</span>
              <br />
              AU SERVICE DE VOTRE CROISSANCE.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs tracking-widest text-white/40 animate-bounce">
        <span>DECOUVRIR</span>
        <ChevronDown size={20} />
      </div>
    </section>
  );
}
