"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Reveal } from "./Reveal";

export function CTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-ink to-ink" />
      <div className="absolute inset-0 aurora opacity-50" />

      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal>
          <h2 className="headline text-4xl md:text-5xl lg:text-6xl mb-6">
            Pret a externaliser vos metiers cles ?
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-lg text-mute mb-10">
            Parlons de votre projet. Premier rendez-vous gratuit et sans engagement.
          </p>
        </Reveal>

        <Reveal delay={200} className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <a href="tel:+261340000000" className="btn btn-outline text-lg px-8 py-4">
            <Phone className="w-5 h-5" />
            Appeler maintenant
          </a>
          <Link href="/contact" className="btn btn-primary text-lg px-8 py-4">
            <Mail className="w-5 h-5" />
            Envoyer un message
          </Link>
        </Reveal>

        <Reveal delay={300}>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-mute">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Antananarivo, Madagascar
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Lun - Ven : 7h - 18h (heure France)
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
