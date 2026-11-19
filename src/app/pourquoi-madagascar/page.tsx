import { Metadata } from "next";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Pourquoi Madagascar",
  description: "Externaliser a Madagascar : cout, langue francaise, fuseau horaire minimal.",
};

const advantages = [
  {
    title: "Un cout maitrise",
    description: "Couts main-d'oeuvre inferieurs France/Belgique/Suisse. Chaque devis chiffre l'economie visee.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Un francais natif",
    description: "Langue d'usage : accueil telephonique, redaction, courriers, relation client.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: "Un decalage horaire minime",
    description: "1-2 heures avec la France. Madagascar n'applique pas l'heure d'ete.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Des equipes dediees et stables",
    description: "Collaborateurs affectes, responsable unique, documentation des procedures.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export default function PourquoiMadagascarPage() {
  return (
    <main className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="max-w-3xl mb-16">
            <span className="kicker mb-4 block">Pourquoi Madagascar</span>
            <h1 className="headline text-4xl md:text-5xl lg:text-6xl mb-6">
              Un avantage de cout, sans sacrifier la qualite
            </h1>
            <p className="text-lg text-mute leading-relaxed">
              Madagascar offre une combinaison unique : francais natif, fuseau horaire proche
              de l'Europe, et couts competitifs.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8">
          {advantages.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div className="glass-card rounded-2xl p-8 flex gap-6">
                <div className="text-primary-light shrink-0">{item.icon}</div>
                <div>
                  <h2 className="headline text-xl mb-2">{item.title}</h2>
                  <p className="text-mute">{item.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={500}>
          <div className="mt-16 text-center">
            <a href="/contact" className="btn btn-primary">
              Demander un devis
            </a>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
