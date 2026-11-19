import Link from "next/link";
import { Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";

const FOOTER_LINKS = {
  solutions: [
    { label: "Forward Deployed Engineers", href: "/solutions#fde" },
    { label: "Automatisation RPA", href: "/solutions#rpa" },
    { label: "Solutions IA", href: "/solutions#ai" },
    { label: "Back-Office", href: "/solutions#backoffice" },
  ],
  company: [
    { label: "A propos", href: "/about" },
    { label: "Carrieres", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Mentions legales", href: "/legal" },
    { label: "Confidentialite", href: "/privacy" },
    { label: "Cookies", href: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-card border-t border-line">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold tracking-tight">STMF</span>
            </Link>
            <p className="text-mute text-sm max-w-xs mb-6">
              L'expertise humaine, augmentee par l'IA. Des equipes dediees a Madagascar
              pour externaliser vos metiers cles.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold mb-4">Solutions</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.solutions.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-mute hover:text-primary-light transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Entreprise</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-mute hover:text-primary-light transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:+261340000000" className="flex items-center gap-2 text-sm text-mute hover:text-primary-light transition-colors">
                  <Phone size={14} />
                  +261 34 00 000 00
                </a>
              </li>
              <li>
                <a href="mailto:contact@stmf-services.com" className="flex items-center gap-2 text-sm text-mute hover:text-primary-light transition-colors">
                  <Mail size={14} />
                  contact@stmf-services.com
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-sm text-mute">
                  <MapPin size={14} />
                  Antananarivo, Madagascar
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-line flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-mute">
            &copy; {new Date().getFullYear()} STMF. Tous droits reserves.
          </p>
          <div className="flex gap-6">
            {FOOTER_LINKS.legal.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-mute hover:text-primary-light transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
