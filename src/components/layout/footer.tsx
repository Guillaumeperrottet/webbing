import Link from "next/link";
import Image from "next/image";
import { Building2, BarChart3, MapPin, CheckCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background border-t border-background/10">
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 ">
              <div className="relative w-35 h-35">
                <Image
                  src="/logo.png"
                  alt="Webbing Logo"
                  width={180}
                  height={180}
                  className="object-contain brightness-0 invert"
                />
              </div>
            </div>
            <p className="text-background/70 text-base mb-6 max-w-md leading-relaxed">
              Solutions SaaS (logiciels accessibles directement en ligne)
              innovantes conçues en Suisse pour optimiser votre gestion
              d&apos;entreprise.
            </p>
            <div className="flex items-center text-background/70">
              <div className="p-2 bg-background/10 rounded-lg mr-3">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">
                Rue de Battentin 1, 1630 Bulle, Suisse
              </span>
            </div>
          </div>

          {/* Applications */}
          <div>
            <h3 className="font-semibold mb-6 text-background">Applications</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="https://www.plannikeeper.ch/"
                  className="group flex items-center text-background/70 hover:text-background transition-colors"
                >
                  <div className="p-1.5 bg-background/10 group-hover:bg-background/20 rounded-lg mr-3 transition-colors">
                    <Building2 className="h-3.5 w-3.5 text-background/70 group-hover:text-background transition-colors" />
                  </div>
                  <span className="text-sm font-medium">PlanniKeeper</span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.chaff.ch/"
                  className="group flex items-center text-background/70 hover:text-background transition-colors"
                >
                  <div className="p-1.5 bg-background/10 group-hover:bg-background/20 rounded-lg mr-3 transition-colors">
                    <BarChart3 className="h-3.5 w-3.5 text-background/70 group-hover:text-background transition-colors" />
                  </div>
                  <span className="text-sm font-medium">Chaff</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://www.selfkey.ch/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center text-background/70 hover:text-background transition-colors"
                >
                  <div className="p-1.5 bg-background/10 group-hover:bg-background/20 rounded-lg mr-3 transition-colors">
                    <CheckCircle className="h-3.5 w-3.5 text-background/70 group-hover:text-background transition-colors" />
                  </div>
                  <span className="text-sm font-medium">Selfkey</span>
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/applications"
                  className="text-sm text-background/70 hover:text-primary transition-colors font-medium"
                >
                  Toutes nos solutions →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-6 text-background">Contact</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center">
                  <div className="mr-3">
                    <a
                      href="mailto:contact@webbing.ch"
                      className="email-button flex items-center justify-center w-10 h-10 rounded-full bg-background border-2 border-background transition-all duration-500 hover:rotate-360 hover:bg-primary group"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-foreground group-hover:text-primary-foreground transition-colors duration-500"
                      >
                        <path
                          d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="currentColor"
                          fillOpacity="0.2"
                        />
                        <path
                          d="M22 6L12 13L2 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-background/50 mb-1">Email</p>
                    <p className="text-sm font-medium text-background">
                      gp@webbing.ch
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center">
                  <div className="mr-3">
                    <a
                      href="tel:+41791234567"
                      className="phone-button flex items-center justify-center w-10 h-10 rounded-full bg-background border-2 border-background transition-all duration-500 hover:rotate-360 hover:bg-primary group"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-foreground group-hover:text-primary-foreground transition-colors duration-500"
                      >
                        <path
                          d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1469 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.5953 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5864 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="currentColor"
                          fillOpacity="0.2"
                        />
                      </svg>
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-background/50 mb-1">Téléphone</p>
                    <p className="text-sm font-medium text-background">
                      +41 79 123 45 67
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center">
                  <div className="mr-3">
                    <a
                      href="https://github.com/Guillaumeperrottet"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="github-button flex items-center justify-center w-10 h-10 rounded-full bg-background border-2 border-background transition-all duration-500 hover:rotate-360 hover:bg-primary group"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-foreground group-hover:text-primary-foreground transition-colors duration-500"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C18.2072 22.5808 20.2772 21.0498 21.7437 19.0074C23.2101 16.965 23.9993 14.5143 24 12C24 5.37 18.63 0 12 0Z"
                          fill="currentColor"
                        />
                      </svg>
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-background/50 mb-1">GitHub</p>
                    <p className="text-sm font-medium text-background">
                      @Guillaumeperrottet
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-background/70 mb-4 md:mb-0">
              © {new Date().getFullYear()} Webbing. Tous droits réservés.
            </div>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-xs text-background/70 hover:text-background transition-colors"
              >
                Confidentialité
              </Link>
              <Link
                href="/terms"
                className="text-xs text-background/70 hover:text-background transition-colors"
              >
                Conditions d&apos;utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
