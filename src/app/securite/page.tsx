import { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { Shield, Lock, Server, FileCheck, Users, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "Securite",
  description: "Notre engagement securite : RGPD, hebergement France, confidentialite.",
};

const measures = [
  {
    icon: <Server size={32} />,
    title: "Hebergement en France",
    description: "Toutes les donnees sensibles sont hebergees sur des serveurs certifies en France, conformes aux normes europeennes.",
  },
  {
    icon: <Lock size={32} />,
    title: "Chiffrement des donnees",
    description: "Communications chiffrees TLS 1.3, donnees au repos chiffrees AES-256. Aucune donnee en clair.",
  },
  {
    icon: <FileCheck size={32} />,
    title: "Conformite RGPD",
    description: "Traitements conformes au RGPD. DPA disponible sur demande. Registre des traitements tenu a jour.",
  },
  {
    icon: <Users size={32} />,
    title: "Acces restreint",
    description: "Principe du moindre privilege. Chaque collaborateur n'accede qu'aux donnees necessaires a sa mission.",
  },
  {
    icon: <Eye size={32} />,
    title: "Audit et tracabilite",
    description: "Journalisation des acces. Audits de securite reguliers. Alertes en temps reel sur les anomalies.",
  },
  {
    icon: <Shield size={32} />,
    title: "Clause de confidentialite",
    description: "Tous nos collaborateurs signent une clause de confidentialite stricte des leur integration.",
  },
];

export default function SecuritePage() {
  return (
    <main className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="max-w-3xl mb-16">
            <span className="kicker mb-4 block">Securite</span>
            <h1 className="headline text-4xl md:text-5xl lg:text-6xl mb-6">
              Vos donnees sont notre priorite
            </h1>
            <p className="text-lg text-mute leading-relaxed">
              L'externalisation ne doit jamais compromettre la securite.
              Nous appliquons les standards les plus stricts pour proteger vos donnees.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {measures.map((measure, i) => (
            <Reveal key={measure.title} delay={i * 80}>
              <div className="glass-card rounded-2xl p-6 h-full">
                <div className="text-primary-light mb-4">{measure.icon}</div>
                <h2 className="headline text-lg mb-2">{measure.title}</h2>
                <p className="text-sm text-mute">{measure.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={500}>
          <div className="glass-card rounded-2xl p-8 max-w-3xl">
            <h2 className="headline text-2xl mb-4">Certifications et engagements</h2>
            <ul className="space-y-3 text-mute">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-light mt-2 shrink-0" />
                <span>Conformite RGPD (Reglement General sur la Protection des Donnees)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-light mt-2 shrink-0" />
                <span>Hebergement sur infrastructure certifiee ISO 27001</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-light mt-2 shrink-0" />
                <span>DPA (Data Processing Agreement) disponible sur demande</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-light mt-2 shrink-0" />
                <span>Politique de retention des donnees transparente</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-light mt-2 shrink-0" />
                <span>Formation securite obligatoire pour tous les collaborateurs</span>
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={600}>
          <div className="mt-12 text-center">
            <p className="text-mute mb-6">
              Une question sur notre politique de securite ?
            </p>
            <a href="/contact" className="btn btn-primary">
              Contactez notre equipe
            </a>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
