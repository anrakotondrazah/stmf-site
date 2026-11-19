import { Metadata } from "next";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Mentions Legales",
  description: "Mentions legales du site STMF.",
};

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="max-w-3xl mb-16">
            <h1 className="headline text-4xl md:text-5xl mb-6">
              Mentions legales
            </h1>
          </div>
        </Reveal>

        <div className="max-w-3xl prose prose-invert">
          <Reveal delay={100}>
            <section className="mb-12">
              <h2 className="headline text-2xl mb-4">Editeur du site</h2>
              <div className="text-mute space-y-2">
                <p><strong>STMF</strong></p>
                <p>Societe de Services et Technologies Madagascar France</p>
                <p>Adresse : Antananarivo, Madagascar</p>
                <p>Email : contact@stmf-services.com</p>
                <p>Telephone : +261 34 00 000 00</p>
              </div>
            </section>
          </Reveal>

          <Reveal delay={200}>
            <section className="mb-12">
              <h2 className="headline text-2xl mb-4">Hebergement</h2>
              <div className="text-mute space-y-2">
                <p><strong>Vercel Inc.</strong></p>
                <p>340 S Lemon Ave #4133</p>
                <p>Walnut, CA 91789, USA</p>
                <p>https://vercel.com</p>
              </div>
            </section>
          </Reveal>

          <Reveal delay={300}>
            <section className="mb-12">
              <h2 className="headline text-2xl mb-4">Propriete intellectuelle</h2>
              <p className="text-mute leading-relaxed">
                L'ensemble du contenu de ce site (textes, images, videos, logos, marques)
                est protege par le droit d'auteur et le droit des marques. Toute reproduction,
                representation ou diffusion, totale ou partielle, sans autorisation expresse
                est interdite.
              </p>
            </section>
          </Reveal>

          <Reveal delay={400}>
            <section className="mb-12">
              <h2 className="headline text-2xl mb-4">Responsabilite</h2>
              <p className="text-mute leading-relaxed">
                STMF s'efforce d'assurer l'exactitude des informations diffusees sur ce site
                mais ne peut garantir leur exhaustivite. STMF decline toute responsabilite
                en cas d'erreur, d'omission ou de resultat obtenu suite a l'utilisation
                des informations fournies.
              </p>
            </section>
          </Reveal>

          <Reveal delay={500}>
            <section>
              <h2 className="headline text-2xl mb-4">Droit applicable</h2>
              <p className="text-mute leading-relaxed">
                Le present site est soumis au droit francais. Tout litige relatif a
                l'utilisation de ce site sera soumis a la competence exclusive des
                tribunaux francais.
              </p>
            </section>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
