import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "STMF | Externalisation & Solutions Digitales",
    template: "%s | STMF",
  },
  description:
    "Des equipes dediees a Madagascar pour externaliser vos metiers cles. Forward Deployed Engineers, Automatisation RPA, Solutions IA sur mesure.",
  keywords: [
    "externalisation",
    "outsourcing",
    "madagascar",
    "FDE",
    "RPA",
    "automatisation",
    "IA",
    "back-office",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen text-white antialiased">
        <SmoothScroll>
          <Header />
          {children}
          <Footer />
        </SmoothScroll>

        {/* Grain Texture */}
        <svg className="grain" aria-hidden="true">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </body>
    </html>
  );
}
