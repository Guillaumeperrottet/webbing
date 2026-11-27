/* eslint-disable @next/next/no-html-link-for-pages -- Native section links preserve project selection and hash navigation. */
import Image from "next/image";

export function Footer() {
  return (
    <footer className="site-footer studio-footer">
      <div className="site-container">
        <div className="footer-studio">
          <a href="/#main" aria-label="Webbing, retour en haut" className="footer-signature">
            <span className="footer-wordmark">
              <Image src="/webbing_informatique.png" alt="Webbing" width={3000} height={3000} sizes="320px" />
            </span>
            <span className="studio-period footer-period" data-ball-anchor="footer" aria-hidden="true" />
          </a>
          <p className="footer-identity">Studio web indépendant.<br />Bulle, Suisse romande.</p>
          <nav aria-label="Navigation de pied de page">
            <a href="/#realisations">Réalisations</a>
            <a href="/#approche">Le studio</a>
            <a href="/#contact">Contact</a>
          </nav>
        </div>
        <div className="footer-details">
          <a href="mailto:gp@webbing.ch">gp@webbing.ch</a>
          <address>Rue de Battentin 1, 1630 Bulle, Suisse</address>
          <a href="https://github.com/Guillaumeperrottet" target="_blank" rel="noopener noreferrer" aria-label="Voir les projets de Guillaume Perrottet sur GitHub (nouvel onglet)">GitHub</a>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Webbing</p>
          <a href="/#main">Retour en haut</a>
        </div>
        <p className="footer-app-store-notice">
          Apple, le logo Apple, iPhone et App Store sont des marques d’Apple Inc., déposées aux États-Unis et dans d’autres pays.
        </p>
      </div>
    </footer>
  );
}
