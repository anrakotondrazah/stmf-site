import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Stats } from "@/components/Stats";
import { Solutions } from "@/components/Solutions";
import { WhyUs } from "@/components/WhyUs";
import { CTA } from "@/components/CTA";

const WebGLMorph = dynamic(() => import("@/components/webgl/WebGLMorph"), {
  ssr: false,
  loading: () => null,
});

export default function HomePage() {
  return (
    <>
      {/* WebGL Background - fixed behind everything */}
      <WebGLMorph mode="full" enableScroll />

      <main className="relative z-10">
        <Hero />
        <Marquee />
        <Stats />
        <Solutions />
        <WhyUs />
        <CTA />
      </main>
    </>
  );
}
