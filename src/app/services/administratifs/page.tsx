import { Metadata } from "next";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Services Administratifs",
  description: "Externalisation administrative : accueil, back-office, comptabilite, gestion locative depuis Madagascar.",
};

const services = [
  {
    title: "Relation client et accueil",
    items: [
      "Accueil telephonique et qualification des appels",
      "Traitement des e-mails et tickets",
      "Prise de rendez-vous, relances",
      "Suivi des demandes jusqu'a la cloture",
    ],
  },
  {
    title: "Back-office et saisie",
    items: [
      "Saisie et traitement de dossiers",
      "Verification et classement de pieces",
      "Mise a jour de bases et logiciels metier",
      "Archivage numerique et indexation",
    ],
  },
  {
    title: "Gestion financiere",
    items: [
      "Rapprochements bancaires",
      "Saisie et controle de factures",
      "Relances d'impayes premier niveau",
      "Preparation de paiements",
    ],
  },
  {
    title: "Gestion locative",
    items: [
      "Quittancement, appels de fonds",
      "Revisions de loyers et regularisation",
      "Dossiers locataires, relances et preavis",
      "Suivi d'interventions et coordination",
    ],
  },
];

export default function ServicesAdministratifsPage() {
  return (
    <main className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="max-w-3xl mb-16">
            <span className="kicker mb-4 block">Services administratifs</span>
            <h1 className="headline text-4xl md:text-5xl lg:text-6xl mb-6">
              Nous executons vos taches
            </h1>
            <p className="text-lg text-mute leading-relaxed">
              Des collaborateurs formes a vos metiers, qui travaillent dans vos outils
              et selon vos procedures. Nous preparons, vous validez.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 80}>
              <div className="glass-card rounded-2xl p-8">
                <h2 className="headline text-xl mb-4">{service.title}</h2>
                <ul className="space-y-3">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-mute">
                      <svg className="w-5 h-5 text-primary-light mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
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
