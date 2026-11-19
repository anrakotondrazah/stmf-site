"use client";

import { useState } from "react";
import { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const faqs = [
  {
    question: "Comment fonctionne l'externalisation avec STMF ?",
    answer: "Nous affectons une equipe dediee a votre entreprise, formee a vos outils et procedures. Un responsable unique coordonne les operations et vous rend compte regulierement. Chaque mission demarre par un cadrage precis et un pilote pour valider l'approche.",
  },
  {
    question: "Quel est le decalage horaire avec Madagascar ?",
    answer: "Madagascar est a GMT+3, soit 1 a 2 heures d'avance sur la France selon la saison. Nos equipes travaillent sur vos horaires de bureau (7h-18h heure France) pour une collaboration fluide.",
  },
  {
    question: "Comment garantissez-vous la securite des donnees ?",
    answer: "Toutes les donnees sensibles sont hebergees en France sur des serveurs certifies. Nos collaborateurs signent des clauses de confidentialite strictes. Nous sommes conformes RGPD et pouvons signer un DPA si necessaire.",
  },
  {
    question: "Quels sont vos tarifs ?",
    answer: "Nos tarifs dependent du volume et de la complexite des taches. En moyenne, nos clients realisent 60% d'economies par rapport a un recrutement en France. Chaque devis est personnalise apres cadrage de votre besoin.",
  },
  {
    question: "Puis-je commencer par un test ?",
    answer: "Oui, nous recommandons systematiquement un pilote sur un perimetre reduit (1-2 semaines) pour valider l'approche avant de generaliser. Cela permet d'ajuster les procedures et de mesurer les resultats.",
  },
  {
    question: "Comment se passe la communication au quotidien ?",
    answer: "Nous utilisons vos outils de communication (Teams, Slack, email, telephone). Un point hebdomadaire avec votre responsable STMF permet de suivre les indicateurs et d'ajuster si besoin.",
  },
  {
    question: "Quelles taches pouvez-vous prendre en charge ?",
    answer: "Nous couvrons l'accueil telephonique, le back-office administratif, la gestion locative, la comptabilite, le developpement web, l'automatisation RPA et les solutions IA. Chaque devis est adapte a votre besoin specifique.",
  },
  {
    question: "Que se passe-t-il si je ne suis pas satisfait ?",
    answer: "Notre engagement qualite inclut une garantie de remplacement. Si un collaborateur ne convient pas, nous le remplacons sans frais. Nos contrats sont flexibles et peuvent etre ajustes mensuellement.",
  },
];

function AccordionItem({ question, answer, isOpen, onClick }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-line">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="headline text-lg pr-4 group-hover:text-primary-light transition-colors">
          {question}
        </span>
        <ChevronDown
          size={20}
          className={cn(
            "shrink-0 text-mute transition-transform duration-300",
            isOpen && "rotate-180 text-primary-light"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-96 pb-6" : "max-h-0"
        )}
      >
        <p className="text-mute leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="max-w-3xl mb-16">
            <span className="kicker mb-4 block">FAQ</span>
            <h1 className="headline text-4xl md:text-5xl lg:text-6xl mb-6">
              Questions frequentes
            </h1>
            <p className="text-lg text-mute leading-relaxed">
              Les reponses aux questions que vous vous posez sur l'externalisation avec STMF.
            </p>
          </div>
        </Reveal>

        <div className="max-w-3xl">
          {faqs.map((faq, i) => (
            <Reveal key={faq.question} delay={i * 50}>
              <AccordionItem
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === i}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </Reveal>
          ))}
        </div>

        <Reveal delay={400}>
          <div className="mt-16 glass-card rounded-2xl p-8 max-w-3xl">
            <h2 className="headline text-xl mb-4">Une autre question ?</h2>
            <p className="text-mute mb-6">
              Notre equipe est disponible pour repondre a toutes vos questions.
            </p>
            <a href="/contact" className="btn btn-primary">
              Nous contacter
            </a>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
