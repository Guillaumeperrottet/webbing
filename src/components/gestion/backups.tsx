import Link from "next/link";
import { DatabaseBackup, ExternalLink, ShieldCheck } from "lucide-react";
import type { Application } from "@/lib/gestion/data";
import { applicationBackup, displayBytes, displayDate } from "@/lib/gestion/presentation";
import { SearchableTable, type SearchableRow } from "./searchable-table";

export function BackupView({ apps }: { apps: Application[] }) {
  const now = Date.now();
  const sources = apps.filter(app => app.backup_required || !!app.backup_reported_at);
  const production = sources.filter(app => app.environment === "production" && app.backup_required);
  const current = production.filter(app => applicationBackup(app, now).state === "disponible").length;
  const tested = production.filter(app => !!app.backup_restore_tested_at).length;
  const rows: SearchableRow[] = sources.map(app => {
    const historic = app.environment === "staging" && !app.backup_required;
    const status = historic ? { state: "unknown", label: "Historique · suivi arrêté" } : applicationBackup(app, now);
    return { id: app.id, search: app.name, environment: app.environment, tags: app.backup_required && status.state !== "disponible" ? ["attention"] : [], cells: [
      <div className="ops-app-name" key="name"><span className="ops-app-initial" aria-hidden="true">{app.name[0].toUpperCase()}</span><div><strong>{app.name}</strong><span className="ops-muted">{historic ? "Staging · copies conservées" : "Production"}</span></div></div>,
      <span className={`ops-badge ops-state-${status.state}`} key="status">{status.label}</span>,
      app.backup_at ? displayDate(app.backup_at) : "Non connue",
      displayBytes(app.backup_bytes),
      app.backup_restore_tested_at ? <span key="restore" className="ops-restore-tested"><ShieldCheck size={15} aria-hidden="true" />{displayDate(app.backup_restore_tested_at)}</span> : <span key="restore" className="ops-muted">Non signalé</span>,
      app.backup_reported_at ? displayDate(app.backup_reported_at) : "En attente du NAS",
    ] };
  });
  return <>
    <section className="ops-backup-summary"><div className="ops-backup-summary-title"><span className="ops-priority-icon"><DatabaseBackup size={22} aria-hidden="true" /></span><div><h2>Synology Campus</h2><p>Les archives restent sur le NAS, dans les dossiers privés de Guillaume.</p></div></div><a className="ops-button ops-button-secondary" href="https://gpcampus-gerance.de9.quickconnect.to/" target="_blank" rel="noopener noreferrer">Ouvrir le Synology<ExternalLink size={15} aria-hidden="true" /></a><dl><div><dt>Sauvegardes à jour</dt><dd>{current}<span> / {production.length}</span></dd></div><div><dt>À vérifier</dt><dd>{production.length - current}</dd></div><div><dt>Restauration déjà testée</dt><dd>{tested}<span> / {production.length}</span></dd></div></dl></section>
    <SearchableTable title="Suivi des sauvegardes" description="Copies récentes et derniers tests de restauration signalés." columns={["Application", "État", "Dernière sauvegarde", "Taille de l’archive", "Dernier test réussi", "Rapport reçu"]} rows={rows} filters={[{ key: "attention", label: "À vérifier" }]} stagingLabel="Staging · historique" action={<Link href="/gestion?vue=connexions">Gérer le suivi</Link>} />
    <p className="ops-notice">Le dernier test réussi concerne une copie précise ; il ne confirme pas la restauration de chaque sauvegarde suivante. Webbing reçoit les métadonnées, jamais le contenu des archives.</p>
  </>;
}
