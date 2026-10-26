import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Github } from "lucide-react";

const navigation = [
  ["Accueil", "/"], ["Applications", "/applications"], ["Projets Web", "/projets"],
  ["À propos", "/about"], ["Contact", "/contact"],
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" aria-label="Webbing, accueil" className="mb-4">
              <Image src="/webbing_informatique_blanc.png" alt="Webbing" width={112} height={112} className="h-24 w-24 object-contain" />
            </Link>
            <p className="max-w-xs leading-relaxed">Applications web et sites internet conçus en Suisse pour valoriser votre activité et simplifier votre gestion d&apos;entreprise.</p>
            <p className="mt-5">Rue de Battentin 1, 1630 Bulle, Suisse</p>
          </div>
          <nav aria-label="Navigation de pied de page">
            <h2>Navigation</h2>
            <ul>
              {navigation.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}
            </ul>
          </nav>
          <div>
            <h2>Applications</h2>
            <ul>
              <li><Link href="https://www.selfcamp.ch/">SelfCamp</Link></li>
              <li><Link href="https://www.plannikeeper.ch/">PlanniKeeper</Link></li>
              <li><Link href="https://wisp.ch/">Wisp</Link></li>
              <li><Link href="/applications">Toutes nos solutions</Link></li>
            </ul>
            <h2 className="mt-6">Sites Web</h2>
            <ul>
              <li><Link href="https://www.pattushotel.ch/fr">Pattùs Hotel</Link></li>
              <li><Link href="https://www.alpha-hotel.ch/">Alpha Hotel</Link></li>
              <li><Link href="/projets">Tous nos projets</Link></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h2>Contact</h2>
            <ul>
              <li><a href="mailto:gp@webbing.ch" aria-label="Envoyer un email à Webbing" className="gap-3"><Mail aria-hidden="true" className="h-4 w-4 shrink-0" />gp@webbing.ch</a></li>
              <li><a href="tel:+41793414074" aria-label="Appeler Webbing" className="gap-3"><Phone aria-hidden="true" className="h-4 w-4 shrink-0" />+41 79 341 40 74</a></li>
              <li><a href="https://github.com/Guillaumeperrottet" target="_blank" rel="noopener noreferrer" aria-label="Voir le profil GitHub de Guillaume Perrottet" className="gap-3"><Github aria-hidden="true" className="h-4 w-4 shrink-0" />@Guillaumeperrottet</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom"><p>© {new Date().getFullYear()} Webbing. Tous droits réservés.</p></div>
      </div>
    </footer>
  );
}
