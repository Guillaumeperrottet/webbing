import type { Application } from "./data";

export type DisplayStatus = { label: string; state: string };

const healthLabels: Record<string, string> = {
  disponible: "Répond", redirection: "Redirection à vérifier", protege: "Accès protégé",
  incident: "Réponse en erreur", injoignable: "Injoignable",
};

function timestamp(value: string | null) {
  return value ? new Date(value).getTime() : NaN;
}

export function applicationHealth(app: Pick<Application, "health_at" | "health_state">, now = Date.now()): DisplayStatus {
  const checked = timestamp(app.health_at);
  if (!Number.isFinite(checked) || !app.health_state) return { label: "À vérifier", state: "unknown" };
  if (now - checked > 45 * 60_000) return { label: "Contrôle ancien", state: "unknown" };
  return healthLabels[app.health_state]
    ? { label: healthLabels[app.health_state], state: app.health_state }
    : { label: "À vérifier", state: "unknown" };
}

export function applicationBackup(app: Pick<Application, "backup_reported_at" | "backup_state" | "backup_at" | "backup_max_hours">, now = Date.now()): DisplayStatus {
  const reported = timestamp(app.backup_reported_at);
  if (!Number.isFinite(reported)) return { label: "Non raccordée", state: "unknown" };
  if (now - reported > 3_600_000) return { label: "Rapport manquant", state: "warning" };
  const saved = timestamp(app.backup_at);
  if (app.backup_state !== "ok" || !Number.isFinite(saved)) return { label: "À vérifier", state: "incident" };
  if (now - saved > (app.backup_max_hours || 24) * 3_600_000) return { label: "Sauvegarde ancienne", state: "warning" };
  return { label: "À jour", state: "disponible" };
}

export function displayDate(value: string | Date | null) {
  return value ? new Date(value).toLocaleString("fr-CH", {
    timeZone: "Europe/Zurich", dateStyle: "short", timeStyle: "short",
  }) : "Pas encore vérifié";
}

export function displayBytes(value: string | null) {
  if (value === null || !Number.isFinite(Number(value))) return "—";
  const bytes = Number(value);
  return bytes >= 1024 ** 3 ? `${(bytes / 1024 ** 3).toFixed(1)} Go` : `${(bytes / 1024 ** 2).toFixed(1)} Mo`;
}

export type ApplicationCard = {
  id: string; name: string; hostname: string; environment: string;
  url: string | null; adminUrl: string | null; vercelUrl: string; databaseUrl: string | null;
  health: DisplayStatus; backup: DisplayStatus | null; needsAttention: boolean;
  checkedAt: string; deployedAt: string | null;
};

export function applicationCard(app: Application, now = Date.now()): ApplicationCard {
  const health = applicationHealth(app, now);
  const backup = app.backup_required || app.backup_reported_at ? applicationBackup(app, now) : null;
  return {
    id: app.id, name: app.name, hostname: app.url ? new URL(app.url).hostname : "Domaine à renseigner",
    environment: app.environment, url: app.url, adminUrl: app.admin_url,
    vercelUrl: `https://vercel.com/guillaumes-projects-faaa7c9a/${encodeURIComponent(app.slug)}`,
    databaseUrl: app.supabase_ref ? `https://supabase.com/dashboard/project/${encodeURIComponent(app.supabase_ref)}` : null,
    health, backup,
    needsAttention: !["disponible", "protege"].includes(health.state) || !!backup && backup.state !== "disponible",
    checkedAt: displayDate(app.health_at), deployedAt: app.current_deployment_at ? displayDate(app.current_deployment_at) : null,
  };
}
