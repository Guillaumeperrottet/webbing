"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- Native section links must dispatch hashchange so the portfolio selects the matching project. */

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ContactLink } from "@/components/project-link";

const navLinks = [
  { href: "/#realisations", label: "Réalisations" },
  { href: "/#approche", label: "Approche" },
];

export function Header() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (menuRef.current) menuRef.current.open = false;
  }, [pathname]);

  const closeMenu = () => { if (menuRef.current) menuRef.current.open = false; };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuRef.current?.open) {
        menuRef.current.open = false;
        menuRef.current.querySelector("summary")?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Link href="/" aria-label="Webbing, accueil" className="header-brand">
          <Image src="/webbing_informatique.png" alt="Webbing" width={96} height={64} className="h-16 w-24 object-contain" priority />
        </Link>
        <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav-link" aria-current={pathname === link.href ? "page" : undefined}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button asChild size="lg" className="text-sm sm:text-base">
            <ContactLink href="/#contact" section="header" onClick={closeMenu}>Parlons-en</ContactLink>
          </Button>
          <details ref={menuRef} className="group mobile-menu md:hidden">
            <summary aria-label="Menu de navigation" className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-md hover:bg-secondary [&::-webkit-details-marker]:hidden">
              <Menu aria-hidden="true" className="menu-open-icon h-6 w-6" />
              <X aria-hidden="true" className="menu-close-icon h-6 w-6" />
            </summary>
            <nav id="mobile-navigation" aria-label="Navigation mobile" className="mobile-nav absolute left-0 right-0 top-full z-50 bg-background px-4 shadow-sm">
              <div className="site-container">
                {navLinks.map((link) => (
                  <a key={link.href} href={link.href} onClick={closeMenu} className="nav-link">
                    {link.label}
                  </a>
                ))}
                <a href="/#contact" onClick={closeMenu} className="nav-link">Contact</a>
              </div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
