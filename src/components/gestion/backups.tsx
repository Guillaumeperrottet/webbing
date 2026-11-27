import Link from "next/link";
import { DatabaseBackup, ExternalLink, ShieldCheck } from "lucide-react";
import type { Application } from "@/lib/gestion/data";
import { applicationBackup, displayBytes, displayDate } from "@/lib/gestion/presentation";

export function BackupView({ apps }: { apps: Application[] }) {
  const now = Date.now();
  const sources = apps.filter(app => app.backup_required || !!app.backup_reported_at);
  const production = sources.filter(app => app.environment === "production" && app.backup_required);
  const current = production.filter(app => applicationBackup(app, now).state === "disponible").length;
  const tested = production.filter(app => !!app.backup_restore_tested_at).length;
  return <>
    <section className="ops-backup-summary"><div className="ops-backup-summary-title"><span className="ops-priority-icon"><DatabaseBackup size={22} aria-hidden="true" /></span><div><h2>Synology Campus</h2><p>Les archives restent sur le NAS, dans les dossiers privés de Guillaume.</p></div></div><a className="ops-button ops-button-secondary" href="https://gpcampus-gerance.de9.quickconnect.to/" target="_blank" rel="noopener noreferrer">Ouvrir le Synology<ExternalLink size={15} aria-hidden="true" /></a><dl><div><dt>Sauvegardes à jour</dt><dd>{current}<span> / {production.length}</span></dd></div><div><dt>À vérifier</dt><dd>{production.length - current}</dd></div><div><dt>Restauration déjà testée</dt><dd>{tested}<span> / {production.length}</span></dd></div></dl></section>
    <section className="ops-panel"><div className="ops-panel-heading"><div><h2>Suivi des sauvegardes</h2><p className="ops-hint">Dates des copies et des derniers tests de restauration signalés.</p></div><Link href="/gestion?vue=connexions">Gérer le suivi</Link></div><div className="ops-table-scroll"><table className="ops-table"><thead><tr><th scope="col">Application</th><th scope="col">État</th><th scope="col">Dernière sauvegarde</th><th scope="col">Taille de l’archive</th><th scope="col">Dernier test réussi</th><th scope="col">Rapport reçu</th></tr></thead><tbody>{sources.map(app => {
      const status = applicationBackup(app, now);
      return <tr key={app.id}><td><div className="ops-app-name"><span className="ops-app-initial" aria-hidden="true">{app.name[0].toUpperCase()}</span><div><strong>{app.name}</strong><span className="ops-muted">{app.environment === "staging" ? "Staging" : "Production"}</span></div></div></td><td><span className={`ops-badge ops-state-${status.state}`}>{status.label}</span></td><td>{app.backup_at ? displayDate(app.backup_at) : "Non connue"}</td><td>{displayBytes(app.backup_bytes)}</td><td>{app.backup_restore_tested_at ? <span className="ops-restore-tested"><ShieldCheck size={15} aria-hidden="true" />{displayDate(app.backup_restore_tested_at)}</span> : <span className="ops-muted">Non signalé</span>}</td><td>{app.backup_reported_at ? displayDate(app.backup_reported_at) : "En attente du NAS"}</td></tr>;
    })}</tbody></table>{sources.length === 0 && <p className="ops-panel-padded ops-empty">Aucune source de sauvegarde configurée. Le raccordement se fait dans Connexions.</p>}</div></section>
    <p className="ops-notice">Le dernier test réussi concerne une copie précise ; il ne confirme pas la restauration de chaque sauvegarde suivante. Webbing reçoit les métadonnées, jamais le contenu des archives.</p>
  </>;
}
