"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Activity, AppWindow, BookOpen, Cable, Cloud, Database, DatabaseBackup, GitPullRequestArrow, Menu, ShieldCheck, Wrench, X } from "lucide-react";
import { Logout } from "./controls";
import { navigationGroups } from "@/lib/gestion/navigation";
const icons = { ensemble: Activity, applications: AppWindow, bases: Database, sauvegardes: DatabaseBackup, dependances: GitPullRequestArrow, deploiements: Cloud, maintenance: Wrench, connexions: Cable, securite: ShieldCheck, journal: BookOpen };

export function MobileNavigation({ view, counts, email }: { view: string; counts: Record<string, number>; email: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 901px)");
    const changed = () => { if (media.matches) setOpen(false); };
    media.addEventListener("change", changed);
    return () => media.removeEventListener("change", changed);
  }, []);
  return <div className="ops-mobile-navigation"><Link className="ops-wordmark" href="/gestion">webbing<span>gestion</span></Link><Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Trigger className="ops-menu-trigger" aria-label="Ouvrir le menu de Gestion"><Menu size={22} aria-hidden="true" /></Dialog.Trigger>
    <Dialog.Portal><Dialog.Overlay className="ops-nav-backdrop" /><Dialog.Content className="ops ops-nav-drawer" aria-describedby="ops-menu-description">
      <div className="ops-drawer-heading"><Dialog.Title>Ton espace de gestion</Dialog.Title><Dialog.Close className="ops-menu-trigger" aria-label="Fermer le menu"><X size={22} aria-hidden="true" /></Dialog.Close></div>
      <Dialog.Description id="ops-menu-description" className="ops-hint">Applications, maintenance et paramètres.</Dialog.Description>
      <nav aria-label="Navigation mobile" className="ops-drawer-links">{navigationGroups.map(group => <div key={group.label}><p className="ops-nav-group-label">{group.label}</p>{group.items.map(([key, label]) => {
        const Icon = icons[key];
        return <Dialog.Close key={key} asChild><Link href={key === "ensemble" ? "/gestion" : `/gestion?vue=${key}`} aria-current={view === key ? "page" : undefined}><Icon size={19} aria-hidden="true" /><span>{label}</span>{counts[key] > 0 && <span className="ops-nav-count" aria-label={`${counts[key]} à vérifier`}>{counts[key]}</span>}</Link></Dialog.Close>;
      })}</div>)}</nav>
      <div className="ops-drawer-footer"><p className="ops-drawer-email">{email}</p><span><ShieldCheck size={16} aria-hidden="true" />Session protégée par 2FA</span><Logout /></div>
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root></div>;
}
