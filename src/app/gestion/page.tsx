import Link from "next/link";
import { Activity, AppWindow, DatabaseBackup, Wrench, Cable, ShieldCheck, BookOpen, Server, Cloud, Database, GitPullRequestArrow } from "lucide-react";
import { requireAdmin } from "@/lib/gestion/access";
import { overview, type Application } from "@/lib/gestion/data";
import { Logout, Refresh, CollectorSetup } from "@/components/gestion/controls";
import { revokeCollector } from "./actions";
import { deployments, supabaseProjects } from "@/lib/gestion/data";
import { integrations } from "@/lib/gestion/providers";
import { DeploymentView, SupabaseView, ProviderConnections } from "@/components/gestion/provider-views";
import { dependencyBatchData } from "@/lib/gestion/dependency-batches";
import { dependencyData } from "@/lib/gestion/github";
import { DependencyView, GitHubConnections } from "@/components/gestion/dependency-views";
import { releaseConnections, releaseHistory } from "@/lib/gestion/releases";
import { PublicationConnections, PublicationPanel } from "@/components/gestion/publications";
import { Overview } from "@/components/gestion/overview";
import { ApplicationDirectory } from "@/components/gestion/application-directory";
import { BackupView } from "@/components/gestion/backups";
import { applicationCard, displayDate as date } from "@/lib/gestion/presentation";
import { dependencyTestState } from "@/lib/gestion/dependency-test-state";
import { ownerPublicationRules } from "@/lib/gestion/owner-releases";
import { OwnerPublicationStatus } from "@/components/gestion/owner-publications";
export const maxDuration=180;

const sections = [
  ["ensemble", "Vue d’ensemble", Activity], ["applications", "Applications", AppWindow], ["deploiements", "Déploiements", Cloud], ["bases", "Bases de données", Database], ["sauvegardes", "Sauvegardes", DatabaseBackup],
  ["dependances", "Mises à jour", GitPullRequestArrow], ["maintenance", "Maintenance", Wrench], ["connexions", "Connexions", Cable], ["securite", "Sécurité", ShieldCheck], ["journal", "Journal", BookOpen],
] as const;
function Badge({ label, state }: { label: string; state: string }) { return <span className={`ops-badge ops-state-${state}`}>{label}</span>; }
function Name({ app }: { app: Application }) { return <div className="ops-app-name"><span className="ops-app-initial" aria-hidden="true">{app.name[0].toUpperCase()}</span><div><strong>{app.name}</strong><span className="ops-muted">{app.environment === "staging" ? "Staging" : "Production"}{app.url ? ` · ${new URL(app.url).hostname}` : " · Domaine à renseigner"}</span></div></div>; }
export default async function Gestion({ searchParams }: { searchParams: Promise<{ vue?: string; filtre?: string; page?: string }> }) {
  const session = await requireAdmin();
  const params=await searchParams;
  const requested = params.vue || "ensemble";
  const view = sections.find((s) => s[0] === requested)?.[0] || "ensemble";
  const title = sections.find((s) => s[0] === view)![1];
  const [{ apps, collectors, audit }, providerConnections, databaseProjects, deploymentHistory, dependencies, batches, publications, releases, personalRules] = await Promise.all([overview(),integrations(),supabaseProjects(),deployments(),dependencyData(),dependencyBatchData(session.user.email), ["deploiements", "connexions"].includes(view) ? releaseConnections() : Promise.resolve([]), view === "deploiements" ? releaseHistory(session.user.email) : Promise.resolve([]), ownerPublicationRules()]);
  const now = Date.now();
  const cards = apps.map(app => applicationCard(app, now));
  const navigationCounts: Record<string, number> = {
    applications: cards.filter(app => app.environment === "production" && app.needsAttention).length,
    dependances: dependencies.updates.filter(update => dependencyTestState(update) === "failed").length,
  };
  return <div className="ops-shell">
    <aside className="ops-sidebar"><Link href="/gestion" className="ops-wordmark">webbing<span>gestion</span></Link><p className="ops-sidebar-caption">Ton centre de contrôle</p>
      <nav aria-label="Gestion">{sections.map(([key, label, Icon]) => <Link key={key} href={key === "ensemble" ? "/gestion" : `/gestion?vue=${key}`} aria-current={view === key ? "page" : undefined}><Icon size={19} aria-hidden="true" /><span>{label}</span>{navigationCounts[key] > 0 && <span className="ops-nav-count" aria-label={`${navigationCounts[key]} à vérifier`}>{navigationCounts[key]}</span>}</Link>)}</nav>
      <div className="ops-sidebar-bottom"><div><ShieldCheck size={17} aria-hidden="true" /><span>Session protégée par 2FA</span></div><Logout /><Link href="/">Ouvrir le site Webbing</Link></div>
    </aside>
    <div className="ops-workspace"><header className="ops-topbar"><span>Espace privé</span><div className="ops-topbar-actions"><span className="ops-user">{session.user.email}<ShieldCheck size={17} aria-label="Double authentification validée" /></span><span className="ops-mobile-logout"><Logout /></span></div></header>
      <div className="ops-content"><div className="ops-page-heading"><div><p className="ops-eyebrow">WEBBING GESTION</p><h1>{title}</h1><p className="ops-lead">{view === "ensemble" ? "L’essentiel de ta production, les priorités et tes accès utiles." : view === "sauvegardes" ? "Savoir ce qui est sauvegardé, et quand." : view === "dependances" ? "Les mises à jour proposées, leurs contrôles et tes validations." : view === "maintenance" ? "Les versions et les automatismes repérés dans tes projets." : view === "connexions" ? "Raccorder tes outils et suivre leurs rapports." : view === "securite" ? "Un accès réservé, vérifié à chaque session." : view === "journal" ? "Les dernières vérifications et opérations de gestion." : "Production et staging, avec leurs accès utiles."}</p></div>{["ensemble", "applications"].includes(view) && <Refresh />}</div>
      {view === "ensemble" && <Overview apps={apps} updates={dependencies.updates} personalPublishing={personalRules.some(rule => rule.enabled)} />}
      {view === "dependances" && <DependencyView {...dependencies} batches={batches} filter={params.filtre} page={Number(params.page)}/>}
      {view === "deploiements" && <><OwnerPublicationStatus rules={personalRules}/><PublicationPanel connections={publications} history={releases}/><DeploymentView items={deploymentHistory}/></>}
      {view === "bases" && <SupabaseView projects={databaseProjects}/>}
      {view === "applications" && <><ApplicationDirectory key={`applications:${params.filtre || "all"}`} apps={cards} initialAttention={params.filtre === "attention"} /><p className="ops-notice">« Répond » confirme une réponse HTTP correcte. Les services internes, paiements et tâches planifiées demandent leurs propres contrôles.</p></>}
      {view === "sauvegardes" && <BackupView apps={apps} />}
      {view === "maintenance" && <><p className="ops-notice">Inventaire importé depuis les dépôts locaux. Les versions affichées sont celles déclarées dans le code, pas une analyse de vulnérabilités ni une confirmation de la version déployée.</p><section className="ops-panel"><div className="ops-table-scroll"><table className="ops-table"><thead><tr><th>Application</th><th>Framework / React</th><th>Node.js Vercel</th><th>Mises à jour</th><th>Tâches déclarées</th><th>Inventaire</th></tr></thead><tbody>{apps.map((a) => <tr key={a.id}><td><Name app={a} /></td><td>{a.framework || "À identifier"}<span className="ops-muted">{a.react_version ? `React ${a.react_version}` : ""}</span></td><td>{a.node_version || "À identifier"}</td><td><Badge label={a.dependency_bot ? "Configuration repérée" : "À configurer"} state={a.dependency_bot ? "disponible" : "unknown"} /></td><td>{a.cron_count} tâche(s)<span className="ops-muted">{a.test_count} script(s) de test</span></td><td>{date(a.inventory_at)}</td></tr>)}</tbody></table></div></section></>}
      {view === "connexions" && <div className="ops-settings-grid"><OwnerPublicationStatus rules={personalRules}/><section className="ops-panel ops-panel-padded"><Server size={25} aria-hidden="true" /><h2>Raccorder le Synology</h2><p>Un collecteur lit les métadonnées des dossiers sélectionnés et les transmet à Webbing en HTTPS. Son accès peut être révoqué ici.</p><CollectorSetup /></section><section className="ops-panel ops-panel-padded"><h2>Collecteurs autorisés</h2>{collectors.length === 0 ? <p className="ops-empty">Aucun collecteur n’est encore raccordé.</p> : collectors.map((c) => <div key={c.id} className="ops-collector-row"><strong>{c.name}</strong><p>Dernier rapport : {c.last_seen ? date(c.last_seen) : "Aucun rapport reçu"}</p><form action={revokeCollector}><input type="hidden" name="id" value={c.id} /><button className="ops-button ops-button-secondary">Révoquer cet accès</button></form></div>)}</section><ProviderConnections connections={providerConnections} projects={databaseProjects}/><GitHubConnections repositories={dependencies.repositories} connections={providerConnections}/><PublicationConnections connections={publications}/></div>}
      {view === "securite" && <section className="ops-panel ops-panel-padded ops-security-panel"><ShieldCheck size={32} aria-hidden="true" /><h2>Ta session est protégée.</h2><p>Mot de passe et second facteur validés. L’accès aux données est contrôlé côté serveur pour chaque requête.</p><dl><div><dt>Compte autorisé</dt><dd>{session.user.email}</dd></div><div><dt>Double authentification</dt><dd>Obligatoire · application d’authentification</dd></div><div><dt>Durée maximale d’une session</dt><dd>8 heures</dd></div><div><dt>Inscriptions publiques</dt><dd>Fermées</dd></div><div><dt>Codes de secours</dt><dd>À conserver dans ton gestionnaire de mots de passe</dd></div></dl><p className="ops-notice">Si tu perds ton téléphone et tes codes, la récupération exige une intervention du propriétaire sur la base de gestion. Aucun accès par simple e-mail ne contourne le second facteur.</p></section>}
      {view === "journal" && <section className="ops-panel"><div className="ops-table-scroll"><table className="ops-table"><thead><tr><th>Date</th><th>Événement</th><th>Détail</th></tr></thead><tbody>{audit.map((entry) => <tr key={entry.id}><td>{date(entry.created_at)}</td><td>{({ connexion_mfa: "Connexion avec double authentification", inventaire: "Inventaire actualisé", activation_compte: "Compte activé", collecteur_cree: "Collecteur autorisé", collecteur_revoque: "Collecteur révoqué", rapport_sauvegardes: "Rapport de sauvegardes reçu", vercel_evenement:"Événement Vercel",supabase_connexion:"Connexion Supabase",connexion_supprimee:"Connexion retirée",github_connexion:"Connexion GitHub",dependance_validee:"Mise à jour validée",dependance_demandee:"Validation de mise à jour demandée",lot_tests_confirme:"Lot de tests confirmé",tests_dependances_demandes:"Tests demandés",publication_en_ligne:"Version publiée et vérifiée",publication_personnelle:"Publication après push personnel",publication_confirmee:"Publication confirmée avec 2FA",protection_production:"Protection des publications",previsualisation_a_isoler:"Prévisualisation à isoler" } as Record<string,string>)[entry.kind] || entry.kind}</td><td>{entry.detail}</td></tr>)}</tbody></table></div></section>}
      <footer className="ops-content-footer"><span>Webbing · Gestion privée</span><span>Heures affichées pour la Suisse</span></footer>
      </div></div>
  </div>;
}
