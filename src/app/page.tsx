import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Stats } from "@/components/Stats";
import { Solutions } from "@/components/Solutions";
import { WhyUs } from "@/components/WhyUs";
import { CTA } from "@/components/CTA";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Stats />
      <Solutions />
      <WhyUs />
      <CTA />
    </main>
  );
}
