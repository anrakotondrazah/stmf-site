"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const SERVICES_MENU = [
  {
    title: "Administratifs",
    href: "/services/administratifs",
    description: "Accueil, back-office, gestion financiere",
  },
  {
    title: "Developpement",
    href: "/services/developpement",
    description: "Sites, apps, automatisation, IA",
  },
];

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services", hasMenu: true },
  { href: "/pourquoi-madagascar", label: "Pourquoi Madagascar" },
  { href: "/methode", label: "Methode" },
  { href: "/realisations", label: "Realisations" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-ink/95 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold tracking-tight">STMF</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="relative">
              {link.hasMenu ? (
                <div ref={servicesRef}>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className={cn(
                      "text-sm font-medium transition-colors relative py-1 flex items-center gap-1",
                      pathname.startsWith("/services")
                        ? "text-primary-light"
                        : "text-white/70 hover:text-white"
                    )}
                  >
                    {link.label}
                    <ChevronDown size={14} className={cn("transition-transform", servicesOpen && "rotate-180")} />
                  </button>
                  {servicesOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 glass-card rounded-xl p-2 shadow-xl">
                      {SERVICES_MENU.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block p-3 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-xs text-mute mt-1">{item.description}</div>
                        </Link>
                      ))}
                      <div className="border-t border-line mt-2 pt-2">
                        <Link
                          href="/services"
                          className="block p-3 rounded-lg hover:bg-white/5 transition-colors text-sm text-primary-light"
                        >
                          Voir tous les services
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors relative py-1",
                    pathname === link.href
                      ? "text-primary-light"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-light rounded-full" />
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="tel:+261340000000"
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
          >
            <Phone size={18} />
          </a>
          <Link href="/contact" className="btn btn-primary text-sm">
            Demander un devis
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-6 pb-6 space-y-4 bg-ink/95 backdrop-blur-xl border-b border-white/5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block py-2 text-lg font-medium",
                pathname === link.href ? "text-primary-light" : "text-white/70"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn-primary w-full justify-center mt-4">
            Demander un devis
          </Link>
        </div>
      </div>
    </header>
  );
}
