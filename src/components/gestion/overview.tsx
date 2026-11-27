import Link from "next/link";
import { Activity, AppWindow, ArrowRight, Check, DatabaseBackup, GitPullRequestArrow, ShieldCheck } from "lucide-react";
import type { Application } from "@/lib/gestion/data";
import type { DependencyUpdate } from "@/lib/gestion/github";
import { dependencyTestState } from "@/lib/gestion/dependency-test-state";
import { applicationBackup, applicationCard, applicationHealth } from "@/lib/gestion/presentation";
import { ApplicationDirectory } from "./application-directory";

export function Overview({ apps, updates, personalPublishing = false }: { apps: Application[]; updates: DependencyUpdate[]; personalPublishing?: boolean }) {
  const now = Date.now();
  const production = apps.filter(app => app.environment === "production");
  const responding = production.filter(app => applicationHealth(app, now).state === "disponible");
  const protectedApps = production.filter(app => applicationHealth(app, now).state === "protege");
  const incidents = production.filter(app => ["incident", "injoignable", "redirection"].includes(applicationHealth(app, now).state));
  const unchecked = production.filter(app => applicationHealth(app, now).state === "unknown");
  const required = production.filter(app => app.backup_required);
  const pendingBackups = required.filter(app => applicationBackup(app, now).state !== "disponible");
  const failed = updates.filter(update => dependencyTestState(update) === "failed");
  const ready = updates.filter(update => update.ready);
  const major = updates.filter(update => update.update_type === "major");
  const priorities = [
    ...(incidents.length ? [{ icon: Activity, title: `${incidents.length} application${incidents.length > 1 ? "s" : ""} à examiner`, detail: incidents.map(app => app.name).slice(0, 3).join(", "), href: "/gestion?vue=applications&filtre=attention", action: "Examiner", tone: "incident" }] : []),
    ...(pendingBackups.length ? [{ icon: DatabaseBackup, title: `${pendingBackups.length} sauvegarde${pendingBackups.length > 1 ? "s" : ""} à vérifier`, detail: "Rapport absent, ancien ou en erreur.", href: "/gestion?vue=sauvegardes", action: "Vérifier", tone: "warning" }] : []),
    ...(failed.length ? [{ icon: GitPullRequestArrow, title: `${failed.length} proposition${failed.length > 1 ? "s" : ""} avec des tests échoués`, detail: "À corriger avant de valider la mise à jour.", href: "/gestion?vue=dependances&filtre=failed", action: "Voir les tests", tone: "warning" }] : []),
    ...(unchecked.length ? [{ icon: Activity, title: `${unchecked.length} contrôle${unchecked.length > 1 ? "s" : ""} HTTP à actualiser`, detail: "La disponibilité récente reste à confirmer.", href: "/gestion?vue=applications&filtre=attention", action: "Voir", tone: "unknown" }] : []),
  ];

  return <>
    <div className="ops-overview-stats">
      <Link href="/gestion?vue=applications"><span className="ops-stat-label"><AppWindow size={17} aria-hidden="true" />Applications en production</span><strong>{production.length}</strong><small>{apps.length - production.length} environnements de staging séparés<ArrowRight size={15} aria-hidden="true" /></small></Link>
      <Link href="/gestion?vue=applications"><span className="ops-stat-label"><Activity size={17} aria-hidden="true" />Répondent au contrôle HTTP</span><strong>{responding.length}<em> / {production.length}</em></strong><small>{protectedApps.length ? `${protectedApps.length} accès protégé${protectedApps.length > 1 ? "s" : ""}` : "Contrôle toutes les 15 minutes"}<ArrowRight size={15} aria-hidden="true" /></small></Link>
      <Link href="/gestion?vue=sauvegardes"><span className="ops-stat-label"><DatabaseBackup size={17} aria-hidden="true" />Sauvegardes à jour</span><strong>{required.length - pendingBackups.length}<em> / {required.length}</em></strong><small>{pendingBackups.length ? "Des sauvegardes demandent ton attention" : required.length ? "Rapports du NAS reçus et récents" : "Aucune sauvegarde requise configurée"}<ArrowRight size={15} aria-hidden="true" /></small></Link>
      <Link href="/gestion?vue=dependances&filtre=failed" className={failed.length ? "ops-stat-warning" : undefined}><span className="ops-stat-label"><GitPullRequestArrow size={17} aria-hidden="true" />Tests de mises à jour échoués</span><strong>{failed.length}</strong><small>{ready.length} proposition{ready.length > 1 ? "s" : ""} prête{ready.length > 1 ? "s" : ""} à valider<ArrowRight size={15} aria-hidden="true" /></small></Link>
    </div>
    <div className="ops-overview-middle">
      <section className="ops-panel ops-priority-panel"><div className="ops-panel-heading"><h2>Ce qui demande ton attention</h2><span className="ops-section-count">{priorities.length}</span></div><div className="ops-priorities">
        {priorities.length ? priorities.map(({ icon: Icon, title, detail, href, action, tone }) => <div key={`${tone}:${href}`}><span className={`ops-priority-icon ops-state-${tone}`}><Icon size={18} aria-hidden="true" /></span><p><strong>{title}</strong><span>{detail}</span></p><Link href={href}>{action}<ArrowRight size={14} aria-hidden="true" /></Link></div>) : <div className="ops-priority-clear"><span className={`ops-priority-icon ops-state-${production.length ? "disponible" : "unknown"}`}><Check size={19} aria-hidden="true" /></span><p><strong>{production.length ? "Aucune alerte dans les derniers rapports." : "Aucune application de production inventoriée."}</strong><span>{production.length ? "Les contrôles HTTP et les sauvegardes requises sont à jour." : "Les applications apparaîtront après leur raccordement."}</span></p></div>}
      </div><p className="ops-monitoring-note">Le contrôle HTTP vérifie la réponse du site. Les paiements et les parcours clients nécessitent leurs propres tests.</p></section>
      <section className="ops-workflow-card"><span className="ops-workflow-symbol"><ShieldCheck size={22} aria-hidden="true" /></span><h2>Tu gardes la main.</h2><p>{personalPublishing ? "Tes changements partent après les contrôles. Les propositions de dépendances restent à valider ici, par lot." : "Les tests se lancent par lot, à ta demande. La mise en ligne exige ta confirmation et un code 2FA."}</p><div><Link href="/gestion?vue=dependances&filtre=major">{major.length} version{major.length > 1 ? "s" : ""} majeure{major.length > 1 ? "s" : ""} à examiner<ArrowRight size={15} aria-hidden="true" /></Link><Link href="/gestion?vue=deploiements">{personalPublishing ? "Voir les publications" : "Préparer une publication"}<ArrowRight size={15} aria-hidden="true" /></Link></div></section>
    </div>
    <ApplicationDirectory key="overview" apps={production.map(app => applicationCard(app, now))} overview />
  </>;
}
