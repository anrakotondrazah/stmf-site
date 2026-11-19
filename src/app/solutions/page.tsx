import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { Marquee } from "@/components/Marquee";
import { CTA } from "@/components/CTA";
import { Rocket, Cpu, Bot, Building, Headphones, Code, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Decouvrez nos solutions d'externalisation: FDE, RPA, IA, Back-Office, Service Client, Developpement Web.",
};

const SOLUTIONS = [
  {
    id: "fde",
    icon: Rocket,
    title: "Forward Deployed Engineers",
    subtitle: "Des ingenieurs integres a vos equipes",
    desc: "Nos FDE travaillent directement avec vos equipes techniques pour deployer, optimiser et maintenir vos solutions. Ils comprennent votre metier et vos contraintes.",
    features: [
      "Integration aux workflows existants",
      "Support technique 24/7",
      "Migration et deploiement",
      "Optimisation des performances",
      "Documentation technique",
      "Formation des equipes",
    ],
    benefits: ["Reduction du time-to-market", "Expertise technique pointue", "Flexibilite et scalabilite"],
  },
  {
    id: "rpa",
    icon: Cpu,
    title: "Automatisation RPA",
    subtitle: "Automatisez vos processus repetitifs",
    desc: "Nous concevons et deployon des workflows intelligents qui automatisent vos taches repetitives. Gagnez du temps et eliminez les erreurs humaines.",
    features: [
      "Workflows n8n & Make",
      "400+ integrations natives",
      "Scripts Python sur mesure",
      "Monitoring et alertes",
      "Documentation complete",
      "Formation utilisateurs",
    ],
    benefits: ["ROI mesurable en semaines", "Zero erreur sur les taches automatisees", "Scalabilite illimitee"],
  },
  {
    id: "ai",
    icon: Bot,
    title: "Solutions IA",
    subtitle: "L'intelligence artificielle au service de votre business",
    desc: "Chatbots, agents vocaux, analyse predictive. Nous integrons l'IA dans vos processus pour augmenter votre productivite.",
    features: [
      "Chatbots intelligents 24/7",
      "Agents vocaux Vapi",
      "Analyse de donnees",
      "Classification automatique",
      "Generation de contenu",
      "Integration API OpenAI",
    ],
    benefits: ["Disponibilite 24/7", "Reponses instantanees", "Reduction des couts de support"],
  },
  {
    id: "backoffice",
    icon: Building,
    title: "Back-Office",
    subtitle: "Gestion administrative externalisee",
    desc: "Comptabilite, saisie de donnees, traitement documentaire. Des equipes formees a vos outils et vos process.",
    features: [
      "Comptabilite locative",
      "Traitement bancaire (camt.053)",
      "Gestion documentaire",
      "Relances et echeances",
      "Etats des lieux",
      "Archivage numerique",
    ],
    benefits: ["Economies de 60%", "Qualite constante", "Scalabilite rapide"],
  },
  {
    id: "service",
    icon: Headphones,
    title: "Service Client",
    subtitle: "L'humain au coeur de la relation client",
    desc: "Accueil telephonique, traitement des demandes, relation locataires. Nos agents sont formes a votre metier.",
    features: [
      "Accueil telephonique",
      "Gestion des emails",
      "Suivi des sollicitations",
      "Coordination prestataires",
      "Reporting quotidien",
      "Escalade intelligente",
    ],
    benefits: ["Satisfaction client +30%", "Temps de reponse < 2h", "Tracabilite complete"],
  },
  {
    id: "dev",
    icon: Code,
    title: "Developpement Web",
    subtitle: "Sites et applications sur mesure",
    desc: "Sites vitrine, applications metier, outils internes. Stack moderne: React, Next.js, TypeScript.",
    features: [
      "Sites professionnels",
      "Applications metier",
      "Tableaux de bord",
      "APIs et integrations",
      "Maintenance evolutive",
      "Hebergement securise",
    ],
    benefits: ["Design moderne", "Performance optimale", "SEO-ready"],
  },
];

export default function SolutionsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-6 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-ink to-ink" />
        <div className="relative text-center max-w-4xl mx-auto">
          <Reveal>
            <span className="kicker mb-4 inline-block">NOS SOLUTIONS</span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="headline text-5xl md:text-6xl lg:text-7xl mb-6">
              Une equipe pensee pour{" "}
              <span className="text-primary-light">chaque metier</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-xl text-mute max-w-2xl mx-auto">
              Service client, developpement commercial, back-office, automatisation IA.
              Des equipes dediees, formees a vos outils.
            </p>
          </Reveal>
        </div>
      </section>

      <Marquee />

      {/* Solutions Detail */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl space-y-32">
          {SOLUTIONS.map((sol, i) => (
            <div key={sol.id} id={sol.id} className="scroll-mt-24">
              <div className={`grid lg:grid-cols-2 gap-16 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                {/* Content */}
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <Reveal>
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                      <sol.icon className="w-8 h-8 text-primary-light" />
                    </div>
                  </Reveal>
                  <Reveal delay={100}>
                    <h2 className="headline text-4xl md:text-5xl mb-2">{sol.title}</h2>
                  </Reveal>
                  <Reveal delay={150}>
                    <p className="text-xl text-primary-light mb-4">{sol.subtitle}</p>
                  </Reveal>
                  <Reveal delay={200}>
                    <p className="text-lg text-mute mb-8">{sol.desc}</p>
                  </Reveal>

                  {/* Benefits */}
                  <Reveal delay={250}>
                    <div className="flex flex-wrap gap-3 mb-8">
                      {sol.benefits.map((benefit) => (
                        <span key={benefit} className="px-4 py-2 rounded-full bg-primary/10 text-sm font-medium text-primary-light">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </Reveal>
                </div>

                {/* Features Card */}
                <Reveal delay={300} className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="glass-card rounded-2xl p-8">
                    <h3 className="text-lg font-semibold mb-6">Ce qui est inclus</h3>
                    <ul className="space-y-4">
                      {sol.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-primary-light" />
                          </span>
                          <span className="text-mute">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTA />
    </main>
  );
}
