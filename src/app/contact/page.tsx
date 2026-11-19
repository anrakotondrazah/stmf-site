import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez STMF pour discuter de votre projet d'externalisation. Premier rendez-vous gratuit.",
};

const CONTACT_INFO = [
  {
    icon: Phone,
    label: "Telephone",
    value: "+261 34 00 000 00",
    href: "tel:+261340000000",
  },
  {
    icon: Mail,
    label: "Email",
    value: "contact@stmf-services.com",
    href: "mailto:contact@stmf-services.com",
  },
  {
    icon: MapPin,
    label: "Adresse",
    value: "Antananarivo, Madagascar",
    href: null,
  },
  {
    icon: Clock,
    label: "Horaires",
    value: "Lun - Ven : 7h - 18h (France)",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center px-6 pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-ink to-ink" />
        <div className="relative text-center max-w-4xl mx-auto">
          <Reveal>
            <span className="kicker mb-4 inline-block">CONTACT</span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="headline text-5xl md:text-6xl lg:text-7xl mb-6">
              Parlons de <span className="text-primary-light">votre projet</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-xl text-mute max-w-2xl mx-auto">
              Premier rendez-vous gratuit et sans engagement.
              Notre equipe vous repond sous 24h.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <Reveal>
              <div className="glass-card rounded-2xl p-8">
                <h2 className="text-2xl font-semibold mb-6">Envoyez-nous un message</h2>
                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstname" className="block text-sm font-medium mb-2">
                        Prenom
                      </label>
                      <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-ink border border-line focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                        placeholder="Jean"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastname" className="block text-sm font-medium mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-ink border border-line focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                        placeholder="Dupont"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email professionnel
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-ink border border-line focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                      placeholder="jean.dupont@entreprise.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      Entreprise
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="w-full px-4 py-3 rounded-xl bg-ink border border-line focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                      placeholder="Nom de votre entreprise"
                    />
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-medium mb-2">
                      Service interesse
                    </label>
                    <select
                      id="service"
                      name="service"
                      className="w-full px-4 py-3 rounded-xl bg-ink border border-line focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                    >
                      <option value="">Selectionnez un service</option>
                      <option value="fde">Forward Deployed Engineers</option>
                      <option value="rpa">Automatisation RPA</option>
                      <option value="ai">Solutions IA</option>
                      <option value="backoffice">Back-Office</option>
                      <option value="service">Service Client</option>
                      <option value="dev">Developpement Web</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Votre message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-ink border border-line focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
                      placeholder="Decrivez votre projet ou vos besoins..."
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-full justify-center text-lg py-4">
                    <Send className="w-5 h-5" />
                    Envoyer le message
                  </button>
                </form>
              </div>
            </Reveal>

            {/* Info */}
            <div className="space-y-8">
              <Reveal delay={100}>
                <h2 className="text-2xl font-semibold mb-6">Informations de contact</h2>
              </Reveal>

              <div className="space-y-6">
                {CONTACT_INFO.map((info, i) => (
                  <Reveal key={info.label} delay={150 + i * 50}>
                    <div className="flex items-start gap-4 p-4 glass-card rounded-xl">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-primary-light" />
                      </div>
                      <div>
                        <div className="text-sm text-mute mb-1">{info.label}</div>
                        {info.href ? (
                          <a href={info.href} className="font-medium hover:text-primary-light transition-colors">
                            {info.value}
                          </a>
                        ) : (
                          <span className="font-medium">{info.value}</span>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={400}>
                <div className="glass-card rounded-2xl p-8 mt-8">
                  <h3 className="text-lg font-semibold mb-4">Pourquoi nous contacter ?</h3>
                  <ul className="space-y-3 text-mute">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-light" />
                      Devis gratuit sous 24h
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-light" />
                      Audit de vos besoins offert
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-light" />
                      Demo personnalisee
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-light" />
                      Aucun engagement
                    </li>
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
