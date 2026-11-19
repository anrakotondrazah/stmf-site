import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { Stats } from "@/components/Stats";
import { CTA } from "@/components/CTA";
import { Users, Target, Lightbulb, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "A propos",
  description: "Decouvrez STMF: notre histoire, notre equipe et notre mission d'externalisation augmentee par l'IA.",
};

const VALUES = [
  {
    icon: Users,
    title: "Expertise humaine",
    desc: "Des equipes formees, motivees et dedicaces a votre succes.",
  },
  {
    icon: Lightbulb,
    title: "Innovation continue",
    desc: "L'IA et l'automatisation au service de la productivite.",
  },
  {
    icon: Target,
    title: "Resultats mesurables",
    desc: "Des KPIs clairs et un ROI prouve des les premieres semaines.",
  },
  {
    icon: Heart,
    title: "Relation long terme",
    desc: "Des partenariats durables bases sur la confiance et la transparence.",
  },
];

const TEAM = [
  { name: "Erica MOERLEN", role: "Directrice Generale", initials: "EM" },
  { name: "Andry RAKOTONDRAZAH", role: "Directeur Technique", initials: "AR" },
  { name: "Equipe Madagascar", role: "50+ collaborateurs", initials: "MG" },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-6 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-ink to-ink" />
        <div className="relative text-center max-w-4xl mx-auto">
          <Reveal>
            <span className="kicker mb-4 inline-block">A PROPOS</span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="headline text-5xl md:text-6xl lg:text-7xl mb-6">
              L'expertise humaine,{" "}
              <span className="text-primary-light">augmentee par l'IA</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-xl text-mute max-w-2xl mx-auto">
              Depuis 2016, nous accompagnons les professionnels francais
              avec des equipes dediees a Madagascar.
            </p>
          </Reveal>
        </div>
      </section>

      <Stats />

      {/* Story */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Reveal>
                <span className="kicker mb-4 inline-block">NOTRE HISTOIRE</span>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="headline text-4xl md:text-5xl mb-6">
                  Une vision nee de l'experience terrain
                </h2>
              </Reveal>
              <Reveal delay={200}>
                <div className="space-y-4 text-lg text-mute">
                  <p>
                    STMF est ne d'un constat simple: les entreprises francaises ont besoin
                    d'externaliser certaines fonctions, mais elles cherchent plus qu'un simple
                    prestataire. Elles veulent un partenaire.
                  </p>
                  <p>
                    En combinant l'expertise humaine de nos equipes a Madagascar et les
                    dernieres avancees en IA et automatisation, nous offrons le meilleur
                    des deux mondes: la qualite et la flexibilite de l'humain, la puissance
                    et la fiabilite de la technologie.
                  </p>
                  <p>
                    Aujourd'hui, nous accompagnons plus de 100 clients dans des secteurs varies:
                    immobilier, energie, e-commerce, sante...
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={300}>
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-lg font-semibold mb-6">Chiffres cles</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-3 border-b border-line">
                    <span className="text-mute">Annee de creation</span>
                    <span className="text-2xl font-bold text-primary-light">2016</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-line">
                    <span className="text-mute">Collaborateurs</span>
                    <span className="text-2xl font-bold text-primary-light">50+</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-line">
                    <span className="text-mute">Clients actifs</span>
                    <span className="text-2xl font-bold text-primary-light">100+</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-mute">Economies moyennes</span>
                    <span className="text-2xl font-bold text-primary-light">60%</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-card">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Reveal>
              <span className="kicker mb-4 inline-block">NOS VALEURS</span>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="headline text-4xl md:text-5xl">
                Ce qui nous <span className="text-primary-light">differencie</span>
              </h2>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delay={200 + i * 50}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary-light" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-mute">{value.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Reveal>
              <span className="kicker mb-4 inline-block">NOTRE EQUIPE</span>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="headline text-4xl md:text-5xl">
                Des experts a <span className="text-primary-light">votre service</span>
              </h2>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {TEAM.map((member, i) => (
              <Reveal key={member.name} delay={200 + i * 100}>
                <div className="glass-card rounded-2xl p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">{member.initials}</span>
                  </div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-mute">{member.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </main>
  );
}
