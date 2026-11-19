import { Metadata } from "next";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Services Developpement",
  description: "Developpement sur mesure, automatisation, RPA, IA et Forward Deployed Engineering depuis Madagascar.",
};

const services = [
  {
    title: "Sites et plateformes web",
    items: [
      "Sites vitrines premium et animations avancees",
      "Applications web sur mesure",
      "Portails clients, extranets, back-offices",
      "Optimisation performances et referencement",
    ],
    tech: "React, Next.js, TypeScript, Tailwind CSS, Vercel",
  },
  {
    title: "Automatisation de workflows",
    items: [
      "Integrations API entre vos outils",
      "Workflows n8n",
      "Notifications et alertes",
      "Generation automatique de documents",
    ],
    tech: "n8n, API REST, Webhooks",
  },
  {
    title: "RPA (automatisation robotisee)",
    items: [
      "Robots pour logiciels sans API",
      "Fin de la double saisie",
      "Extraction et controle de donnees",
      "Taches planifiees",
    ],
    tech: "Playwright, Puppeteer",
  },
  {
    title: "IA appliquee",
    items: [
      "Agents vocaux IA pour accueil telephonique",
      "Assistants e-mail (tri, brouillons)",
      "Extraction de donnees de documents",
      "Chatbots connectes a vos donnees",
    ],
    tech: "OpenAI API, Vapi, ElevenLabs, Deepgram",
  },
  {
    title: "Forward Deployed Engineering",
    items: [
      "Ingenieur integre a votre equipe",
      "Comprend votre metier sur le terrain",
      "Construit l'outil dans vos conditions reelles",
      "Itere avec vos utilisateurs",
    ],
    tech: "Stack adaptee a vos besoins",
  },
];

export default function ServicesDeveloppementPage() {
  return (
    <main className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="max-w-3xl mb-16">
            <span className="kicker mb-4 block">Services developpement</span>
            <h1 className="headline text-4xl md:text-5xl lg:text-6xl mb-6">
              Nous construisons vos outils
            </h1>
            <p className="text-lg text-mute leading-relaxed">
              Du simple outil sur mesure a l'ingenierie integree a votre equipe.
              Developpement, automatisation, RPA, IA.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 60}>
              <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
                <h2 className="headline text-lg mb-4">{service.title}</h2>
                <ul className="space-y-2 flex-1">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-mute">
                      <span className="w-1 h-1 rounded-full bg-primary-light mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-line">
                  <span className="text-xs text-mute font-mono">{service.tech}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={400}>
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
