import Link from "next/link";
import { Building2, BarChart3, Mail, MapPin, CheckCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-slate-900 font-bold text-sm">W</span>
              </div>
              <span className="font-bold text-xl">Webbing</span>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              Solutions SaaS innovantes conçues en Suisse pour optimiser votre
              gestion immobilière et vos analyses business.
            </p>
            <div className="flex items-center text-slate-300 text-sm">
              <MapPin className="h-4 w-4 mr-2" />
              Fribourg, Suisse
            </div>
          </div>

          {/* Applications */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Applications</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link
                  href="https://www.plannikeeper.ch/"
                  className="hover:text-white transition-colors flex items-center"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  PlanniKeeper
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.chaff.ch/"
                  className="hover:text-white transition-colors flex items-center"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Chaff
                </Link>
              </li>
              <li>
                <a
                  href="https://www.selfkey.ch/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Selfkey
                </a>
              </li>
              <li>
                <Link
                  href="/applications"
                  className="hover:text-white transition-colors"
                >
                  Toutes nos solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Entreprise</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Conditions d&apos;utilisation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Contact</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <a
                  href="mailto:contact@webbing.ch"
                  className="hover:text-white transition-colors"
                >
                  contact@webbing.ch
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8 text-center text-sm text-slate-300">
          <p>
            &copy; {new Date().getFullYear()} Webbing. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
