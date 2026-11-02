/* eslint-disable @next/next/no-html-link-for-pages -- Native section links must dispatch hashchange so Applications and Sites web select the matching project. */

import Image from "next/image";
import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-colophon">
          <Link href="/#main" aria-label="Webbing, retour en haut" className="footer-wordmark">
            <Image src="/webbing_informatique_blanc.png" alt="Webbing" width={112} height={80} />
          </Link>
          <p>Sites et applications web sur mesure.<br />Rue de Battentin 1, 1630 Bulle, Suisse.</p>
          <nav aria-label="Navigation de pied de page">
            <a href="/#applications">Applications</a>
            <a href="/#sites-web">Sites web</a>
            <a href="/#approche">À propos</a>
            <a href="/#contact">Contact</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Webbing. Tous droits réservés.</p>
          <a href="https://github.com/Guillaumeperrottet" target="_blank" rel="noopener noreferrer" aria-label="Voir le profil GitHub de Guillaume Perrottet" className="footer-github"><Github size={18} aria-hidden="true" />Guillaume Perrottet</a>
        </div>
      </div>
    </footer>
  );
}
