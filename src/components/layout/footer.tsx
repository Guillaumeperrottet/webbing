import Link from "next/link";
import { Building2, BarChart3, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-sm">W</span>
              </div>
              <span className="font-bold text-xl">Webbing</span>
            </div>
            <p className="text-primary-foreground/70 text-sm mb-4">
              Solutions SaaS innovantes conçues en Suisse pour optimiser votre
              gestion immobilière et vos analyses business.
            </p>
            <div className="flex items-center text-primary-foreground/70 text-sm">
              <MapPin className="h-4 w-4 mr-2" />
              Genève, Suisse
            </div>
          </div>

          {/* Applications */}
          <div>
            <h3 className="font-semibold mb-4">Applications</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link
                  href="/applications/plannikeeper"
                  className="hover:text-primary-foreground transition-colors flex items-center"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  PlanniKeeper
                </Link>
              </li>
              <li>
                <Link
                  href="/applications/chaff"
                  className="hover:text-primary-foreground transition-colors flex items-center"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Chaff
                </Link>
              </li>
              <li>
                <Link
                  href="/applications"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Toutes nos solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary-foreground transition-colors"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Conditions d&apos;utilisation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-primary-foreground/70">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <a
                  href="mailto:contact@webbing.ch"
                  className="hover:text-primary-foreground transition-colors"
                >
                  contact@webbing.ch
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-sm text-primary-foreground/70">
          <p>
            &copy; {new Date().getFullYear()} Webbing. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
