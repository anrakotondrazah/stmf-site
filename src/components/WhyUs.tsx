"use client";

import { Euro, Clock, Languages, ShieldCheck } from "lucide-react";
import { Reveal } from "./Reveal";
import Link from "next/link";

const BENEFITS = [
  {
    icon: Euro,
    title: "-60% de couts",
    desc: "Externalisation Madagascar",
  },
  {
    icon: Clock,
    title: "Meme fuseau horaire",
    desc: "GMT+3 = disponibilite France",
  },
  {
    icon: Languages,
    title: "Francophonie native",
    desc: "Equipes 100% francophones",
  },
  {
    icon: ShieldCheck,
    title: "Securite RGPD",
    desc: "Donnees hebergees en France",
  },
];

export function WhyUs() {
  return (
    <section className="py-24 px-6 bg-card">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <Reveal>
              <span className="kicker inline-flex items-center gap-2 mb-4">
                <span className="pulse-dot" />
                POURQUOI STMF
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="headline text-4xl md:text-5xl mb-6">
                L'expertise humaine,{" "}
                <span className="text-primary-light">augmentee par l'IA</span>
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="text-lg text-mute mb-8">
                Depuis 2016, nous accompagnons les professionnels francais avec des equipes
                dediees a Madagascar. Notre avantage : des tarifs competitifs (-60% vs France)
                sans compromis sur la qualite.
              </p>
            </Reveal>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {BENEFITS.map((benefit, i) => (
                <Reveal key={benefit.title} delay={200 + i * 50}>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-ink/50 border border-line">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-primary-light" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{benefit.title}</div>
                      <div className="text-xs text-mute">{benefit.desc}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={400}>
              <Link href="/contact" className="btn btn-primary">
                Demander un devis gratuit
              </Link>
            </Reveal>
          </div>

          {/* Calculator Card */}
          <Reveal delay={300}>
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="px-6 py-4 bg-primary/10 border-b border-line">
                <span className="text-sm font-semibold text-primary-light">
                  Calculateur d'economies
                </span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-mute">Cout moyen France</span>
                  <span className="text-lg font-semibold text-mute line-through">3 500 EUR/mois</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-mute">Cout STMF Madagascar</span>
                  <span className="text-lg font-semibold text-primary-light">1 400 EUR/mois</span>
                </div>
                <div className="h-px bg-line" />
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm text-mute">Economies annuelles</span>
                  <span className="text-2xl font-bold text-primary-light">25 200 EUR</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
