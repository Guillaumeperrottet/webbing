"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/applications", label: "Applications" },
  { href: "/projets", label: "Projets" },
  { href: "/about", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (menuRef.current) menuRef.current.open = false;
  }, [pathname]);

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
        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link" aria-current={pathname === link.href ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button asChild size="lg" className="text-sm sm:text-base">
            <Link href="/contact">Nous contacter</Link>
          </Button>
          <details ref={menuRef} className="group lg:hidden">
            <summary aria-label="Menu de navigation" className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-md hover:bg-secondary [&::-webkit-details-marker]:hidden">
              <Menu aria-hidden="true" className="h-6 w-6" />
            </summary>
            <nav id="mobile-navigation" aria-label="Navigation mobile" className="mobile-nav absolute left-0 right-0 top-full z-50 bg-background px-4 shadow-sm">
              <div className="site-container">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="nav-link" aria-current={pathname === link.href ? "page" : undefined}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
