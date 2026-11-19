import { Metadata } from "next";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Politique de Confidentialite",
  description: "Politique de confidentialite et protection des donnees personnelles STMF.",
};

export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="max-w-3xl mb-16">
            <h1 className="headline text-4xl md:text-5xl mb-6">
              Politique de confidentialite
            </h1>
            <p className="text-mute">Derniere mise a jour : Novembre 2026</p>
          </div>
        </Reveal>

        <div className="max-w-3xl">
          <Reveal delay={100}>
            <section className="mb-12">
              <h2 className="headline text-2xl mb-4">Collecte des donnees</h2>
              <p className="text-mute leading-relaxed mb-4">
                STMF collecte les donnees personnelles que vous nous transmettez volontairement
                via nos formulaires de contact : nom, prenom, email, telephone, nom de l'entreprise.
              </p>
              <p className="text-mute leading-relaxed">
                Ces donnees sont collectees uniquement pour repondre a vos demandes et vous
                proposer nos services. Elles ne sont jamais vendues a des tiers.
              </p>
            </section>
          </Reveal>

          <Reveal delay={200}>
            <section className="mb-12">
              <h2 className="headline text-2xl mb-4">Utilisation des donnees</h2>
              <p className="text-mute leading-relaxed">
                Vos donnees personnelles sont utilisees exclusivement pour :
              </p>
              <ul className="list-disc list-inside text-mute mt-4 space-y-2">
                <li>Repondre a vos demandes de contact ou de devis</li>
                <li>Vous envoyer des informations sur nos services si vous l'avez accepte</li>
                <li>Ameliorer notre site et nos services</li>
                <li>Respecter nos obligations legales</li>
              </ul>
            </section>
          </Reveal>

          <Reveal delay={300}>
            <section className="mb-12">
              <h2 className="headline text-2xl mb-4">Conservation des donnees</h2>
              <p className="text-mute leading-relaxed">
                Vos donnees personnelles sont conservees pendant une duree de 3 ans a compter
                du dernier contact. Passe ce delai, elles sont supprimees ou anonymisees.
              </p>
            </section>
          </Reveal>

          <Reveal delay={400}>
            <section className="mb-12">
              <h2 className="headline text-2xl mb-4">Vos droits (RGPD)</h2>
              <p className="text-mute leading-relaxed mb-4">
                Conformement au Reglement General sur la Protection des Donnees (RGPD),
                vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside text-mute space-y-2">
                <li>Droit d'acces a vos donnees personnelles</li>
                <li>Droit de rectification des donnees inexactes</li>
                <li>Droit a l'effacement de vos donnees</li>
                <li>Droit a la portabilite de vos donnees</li>
                <li>Droit d'opposition au traitement</li>
                <li>Droit de retirer votre consentement a tout moment</li>
              </ul>
              <p className="text-mute leading-relaxed mt-4">
                Pour exercer ces droits, contactez-nous a : contact@stmf-services.com
              </p>
            </section>
          </Reveal>

          <Reveal delay={500}>
            <section className="mb-12">
              <h2 className="headline text-2xl mb-4">Cookies</h2>
              <p className="text-mute leading-relaxed">
                Ce site utilise uniquement des cookies techniques necessaires a son fonctionnement.
                Aucun cookie publicitaire ou de tracking tiers n'est utilise.
              </p>
            </section>
          </Reveal>

          <Reveal delay={600}>
            <section>
              <h2 className="headline text-2xl mb-4">Contact</h2>
              <p className="text-mute leading-relaxed">
                Pour toute question relative a cette politique de confidentialite,
                contactez-nous a : contact@stmf-services.com
              </p>
            </section>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
