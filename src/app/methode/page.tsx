import { Metadata } from "next";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Methode et Devis",
  description: "Notre methode : echange, cadrage, devis dedie, pilote, pilotage continu.",
};

const steps = [
  {
    number: "01",
    title: "Echange",
    description: "30 minutes pour comprendre votre besoin et votre contexte.",
  },
  {
    number: "02",
    title: "Cadrage",
    description: "Audit des taches, outils et volumes. Definition du perimetre.",
  },
  {
    number: "03",
    title: "Devis",
    description: "Devis dedie avec perimetre, livrables et calendrier clairs.",
  },
  {
    number: "04",
    title: "Pilote",
    description: "Test sur un perimetre reduit pour valider l'approche.",
  },
  {
    number: "05",
    title: "Pilotage",
    description: "Indicateurs partages, points reguliers, amelioration continue.",
  },
];

const modes = [
  {
    title: "Mission ponctuelle",
    description: "Prix fixe sur devis pour un besoin defini.",
  },
  {
    title: "Forfait recurrent",
    description: "Volume mensuel avec reporting regulier.",
  },
  {
    title: "Equipe dediee",
    description: "Collaborateurs affectes, responsable unique.",
  },
];

export default function MethodePage() {
  return (
    <main className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="max-w-3xl mb-16">
            <span className="kicker mb-4 block">Notre methode</span>
            <h1 className="headline text-4xl md:text-5xl lg:text-6xl mb-6">
              Un devis distinct pour chaque besoin
            </h1>
            <p className="text-lg text-mute leading-relaxed">
              Chaque demande est cadree puis chiffree separement.
              Pas de forfait opaque, pas de surprise.
            </p>
          </div>
        </Reveal>

        <div className="mb-20">
          <Reveal>
            <h2 className="headline text-2xl mb-8">Les 5 etapes</h2>
          </Reveal>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-line hidden md:block" />
            <div className="space-y-8">
              {steps.map((step, i) => (
                <Reveal key={step.number} delay={i * 100}>
                  <div className="flex gap-8 items-start">
                    <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center shrink-0 relative z-10">
                      <span className="text-primary-light font-mono text-lg">{step.number}</span>
                    </div>
                    <div className="pt-3">
                      <h3 className="headline text-xl mb-2">{step.title}</h3>
                      <p className="text-mute">{step.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <Reveal>
          <h2 className="headline text-2xl mb-8">Trois modes d'engagement</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {modes.map((mode, i) => (
            <Reveal key={mode.title} delay={i * 100}>
              <div className="glass-card rounded-2xl p-6 text-center">
                <h3 className="headline text-lg mb-2">{mode.title}</h3>
                <p className="text-sm text-mute">{mode.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="text-center">
            <a href="/contact" className="btn btn-primary">
              Demander un devis
            </a>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
