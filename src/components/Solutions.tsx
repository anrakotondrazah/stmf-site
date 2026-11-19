"use client";

import { Rocket, Cpu, Bot, Building, Headphones, Code } from "lucide-react";
import { Reveal } from "./Reveal";
import Link from "next/link";

const SOLUTIONS = [
  {
    id: "fde",
    icon: Rocket,
    title: "Forward Deployed Engineers",
    desc: "Des ingenieurs dedies qui s'integrent a vos equipes pour deployer, optimiser et maintenir vos solutions techniques.",
    features: ["Integration continue", "Support technique 24/7", "Migration & deploiement"],
    popular: false,
  },
  {
    id: "rpa",
    icon: Cpu,
    title: "Automatisation RPA",
    desc: "Automatisez vos processus repetitifs avec nos workflows intelligents. n8n, Make, scripts sur mesure.",
    features: ["Workflows n8n/Make", "400+ integrations", "ROI mesurable"],
    popular: true,
  },
  {
    id: "ai",
    icon: Bot,
    title: "Solutions IA",
    desc: "Chatbots intelligents, agents vocaux IA, analyse de donnees. L'IA au service de votre productivite.",
    features: ["Chatbots 24/7", "Agents vocaux Vapi", "Analyse predictive"],
    popular: false,
  },
  {
    id: "backoffice",
    icon: Building,
    title: "Back-Office",
    desc: "Gestion administrative, comptabilite, saisie de donnees. Des equipes formees a vos outils.",
    features: ["Comptabilite locative", "Traitement bancaire", "Gestion documentaire"],
    popular: false,
  },
  {
    id: "service",
    icon: Headphones,
    title: "Service Client",
    desc: "Accueil telephonique, traitement des demandes, relation locataires. Une reponse humaine, augmentee par l'IA.",
    features: ["Accueil des appels", "Suivi des sollicitations", "Coordination terrain"],
    popular: false,
  },
  {
    id: "dev",
    icon: Code,
    title: "Developpement Web",
    desc: "Sites vitrine, applications metier, outils sur mesure. React, Next.js, TypeScript.",
    features: ["Sites professionnels", "Applications metier", "Maintenance & support"],
    popular: false,
  },
];

export function Solutions() {
  return (
    <section id="solutions" className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <Reveal>
          <span className="kicker inline-flex items-center gap-2 mb-4">
            <span className="pulse-dot" />
            SOLUTIONS
          </span>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="headline text-4xl md:text-5xl lg:text-6xl mb-4">
            Une equipe STMF pensee pour{" "}
            <span className="text-primary-light">chaque metier</span>
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="text-lg text-mute max-w-2xl mb-12">
            Service client, developpement commercial, back-office, automatisation IA.
            Des equipes dediees a votre activite.
          </p>
        </Reveal>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOLUTIONS.map((sol, i) => (
            <Reveal key={sol.id} delay={200 + i * 50}>
              <div className={`gradient-border glass-card rounded-2xl p-6 h-full flex flex-col ${sol.popular ? "ring-2 ring-primary" : ""}`}>
                {sol.popular && (
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-xs font-semibold text-ink">
                    Populaire
                  </span>
                )}

                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <sol.icon className="w-6 h-6 text-primary-light" />
                </div>

                <h3 className="text-xl font-semibold mb-2">{sol.title}</h3>
                <p className="text-sm text-mute mb-4 flex-grow">{sol.desc}</p>

                <ul className="space-y-2 mb-6">
                  {sol.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-mute">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-light" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/solutions#${sol.id}`}
                  className="text-sm font-medium text-primary-light hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  En savoir plus
                  <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
