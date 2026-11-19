import { Metadata } from "next";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Realisations",
  description: "Nos projets : sites, automatisations, agents IA. Des solutions concretes.",
};

const projects = [
  {
    title: "Prospection B2B automatisee",
    category: "Automatisation",
    description: "Workflow n8n : selection entreprises, e-mails personnalises, tri IA.",
    tech: ["n8n", "API", "IA"],
  },
  {
    title: "Filtrage releves bancaires",
    category: "Developpement",
    description: "Outil de traitement CAMT.053 pour comptabilite simplifiee.",
    tech: ["Next.js", "TypeScript"],
  },
  {
    title: "Accueil telephonique IA",
    category: "IA",
    description: "Agent vocal pour qualification d'appels et creation fiches.",
    tech: ["Vapi", "OpenAI"],
  },
  {
    title: "Application gestion energie",
    category: "Developpement",
    description: "Plateforme de gestion et devis secteur energie.",
    tech: ["React", "Node.js"],
  },
  {
    title: "Plateforme gestion immobiliere",
    category: "Developpement",
    description: "Application complete de gestion locative en Next.js.",
    tech: ["Next.js", "PostgreSQL"],
  },
  {
    title: "Site vitrine anime",
    category: "Design",
    description: "Portfolio avec animations WebGL avancees.",
    tech: ["Three.js", "GSAP"],
  },
];

export default function RealisationsPage() {
  return (
    <main className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="max-w-3xl mb-16">
            <span className="kicker mb-4 block">Realisations</span>
            <h1 className="headline text-4xl md:text-5xl lg:text-6xl mb-6">
              Des projets concrets
            </h1>
            <p className="text-lg text-mute leading-relaxed">
              Le probleme, la solution, le resultat. Pas de jargon.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <Reveal key={project.title} delay={i * 80}>
              <div className="glass-card rounded-2xl p-6 h-full flex flex-col group hover:border-primary-light transition-colors">
                <span className="text-xs font-mono text-primary-light mb-3">
                  {project.category}
                </span>
                <h2 className="headline text-lg mb-2 group-hover:text-primary-light transition-colors">
                  {project.title}
                </h2>
                <p className="text-sm text-mute flex-1 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-1 rounded-full bg-white/5 text-mute"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={600}>
          <div className="mt-16 glass-card rounded-2xl p-8 text-center">
            <h2 className="headline text-2xl mb-4">
              Le site que vous visitez est notre premiere reference
            </h2>
            <p className="text-mute mb-6 max-w-2xl mx-auto">
              Chaque animation de cette page est codee a la main, sans modele pret a l'emploi.
              C'est le niveau d'exigence que nous appliquons a vos outils.
            </p>
            <a href="/contact" className="btn btn-primary">
              Demander un devis
            </a>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
