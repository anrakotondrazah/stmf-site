import { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Services",
  description: "Services d'externalisation administrative et developpement sur mesure depuis Madagascar.",
};

const services = [
  {
    title: "Services Administratifs",
    description: "Equipes dediees pour vos taches administratives : accueil, back-office, gestion financiere, gestion locative.",
    href: "/services/administratifs",
    items: ["Relation client", "Back-office", "Gestion financiere", "Gestion locative"],
  },
  {
    title: "Services Developpement",
    description: "Developpement sur mesure, automatisation, RPA, IA et Forward Deployed Engineering.",
    href: "/services/developpement",
    items: ["Sites & apps", "Automatisation", "RPA", "IA appliquee"],
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="max-w-3xl mb-16">
            <span className="kicker mb-4 block">Nos services</span>
            <h1 className="headline text-4xl md:text-5xl lg:text-6xl mb-6">
              Deux metiers, un partenaire
            </h1>
            <p className="text-lg text-mute leading-relaxed">
              Nous executons vos taches administratives et nous construisons vos outils numeriques.
              Un seul partenaire, un devis distinct pour chaque besoin.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 100}>
              <Link href={service.href} className="block group">
                <div className="glass-card rounded-2xl p-8 h-full">
                  <h2 className="headline text-2xl mb-4 group-hover:text-primary-light transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-mute mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-light" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center gap-2 text-primary-light text-sm font-medium">
                    En savoir plus
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
