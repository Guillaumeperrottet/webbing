"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowUpRight, DatabaseBackup, Search, X } from "lucide-react";
import type { ApplicationCard } from "@/lib/gestion/presentation";

function normalized(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr");
}

export function ApplicationDirectory({ apps, overview = false, initialAttention = false }: {
  apps: ApplicationCard[]; overview?: boolean; initialAttention?: boolean;
}) {
  const id = useId();
  const [search, setSearch] = useState("");
  const [environment, setEnvironment] = useState("production");
  const [attention, setAttention] = useState(initialAttention);
  const query = normalized(search.trim());
  const scoped = apps.filter(app => app.environment === environment);
  const attentionCount = scoped.filter(app => app.needsAttention).length;
  const visible = scoped.filter(app => (!attention || app.needsAttention) && normalized(`${app.name} ${app.hostname}`).includes(query));

  return <section className="ops-directory" aria-labelledby={`${id}-title`}>
    <div className="ops-directory-heading"><div><p className="ops-eyebrow">LES APPLICATIONS</p><h2 id={`${id}-title`}>{overview ? "Ta production, au même endroit" : "Retrouver une application"}</h2></div>{overview && <Link href="/gestion?vue=applications" className="ops-directory-all">Tous les environnements<ArrowUpRight size={16} aria-hidden="true" /></Link>}</div>
    <div className="ops-directory-toolbar">
      <div className="ops-search"><Search size={18} aria-hidden="true" /><label className="ops-sr-only" htmlFor={`${id}-search`}>Rechercher une application</label><input type="search" id={`${id}-search`} placeholder="Rechercher une application…" value={search} onChange={event => setSearch(event.target.value)} />{search && <button type="button" aria-label="Effacer la recherche" onClick={() => setSearch("")}><X size={16} aria-hidden="true" /></button>}</div>
      <div className="ops-directory-filters">
        {!overview && <div className="ops-segmented" role="group" aria-label="Environnement">{[["production", "Production"], ["staging", "Staging"]].map(([key, label]) => <button type="button" key={key} aria-pressed={environment === key} onClick={() => setEnvironment(key)}>{label}<span>{apps.filter(app => app.environment === key).length}</span></button>)}</div>}
        <button type="button" className="ops-attention-filter" aria-pressed={attention} onClick={() => setAttention(value => !value)}>À vérifier<span>{attentionCount}</span></button>
      </div>
    </div>
    <p className="ops-directory-count" role="status">{visible.length} application{visible.length > 1 ? "s" : ""}{attention ? " à vérifier" : environment === "production" ? " en production" : " en staging"}{query ? ` pour « ${search.trim()} »` : ""}</p>
    <div className="ops-application-grid">{visible.map(app => <article className="ops-application-card" key={app.id}>
      <div className="ops-card-heading"><span className="ops-app-initial" aria-hidden="true">{app.name[0].toUpperCase()}</span><div><h3>{app.name}</h3><p>{app.hostname}</p></div><span className={`ops-status-dot ops-state-${app.health.state}`} role="img" aria-label={`Disponibilité HTTP : ${app.health.label}`} /></div>
      <dl className="ops-card-statuses"><div><dt>Disponibilité HTTP</dt><dd><span className={`ops-badge ops-state-${app.health.state}`}>{app.health.label}</span></dd></div><div><dt><DatabaseBackup size={14} aria-hidden="true" />Sauvegarde</dt><dd>{app.backup ? <Link href="/gestion?vue=sauvegardes" className={`ops-badge ops-state-${app.backup.state}`}>{app.backup.label}</Link> : <span className="ops-muted">Non requise</span>}</dd></div></dl>
      <p className="ops-card-checked">Contrôle · {app.checkedAt}</p>
      <div className="ops-card-footer"><div>{app.url && <a href={app.url} target="_blank" rel="noopener noreferrer" aria-label={`Ouvrir le site ${app.name}`}>Ouvrir le site<ArrowUpRight size={15} aria-hidden="true" /></a>}{app.adminUrl && <a href={app.adminUrl} target="_blank" rel="noopener noreferrer" aria-label={`Ouvrir l’administration de ${app.name}`}>Admin<ArrowUpRight size={15} aria-hidden="true" /></a>}</div><Link href="/gestion?vue=deploiements" aria-label={`Voir les déploiements pour ${app.name}`} title={app.deployedAt ? `Version en service depuis le ${app.deployedAt}` : "Voir le suivi des déploiements"}>Déploiements<ArrowUpRight size={14} aria-hidden="true" /></Link></div>
      <details className="ops-card-details"><summary>Accès techniques</summary><div><a href={app.vercelUrl} target="_blank" rel="noopener noreferrer" aria-label={`Ouvrir Vercel pour ${app.name}`}>Vercel<ArrowUpRight size={13} aria-hidden="true" /></a>{app.databaseUrl && <a href={app.databaseUrl} target="_blank" rel="noopener noreferrer" aria-label={`Ouvrir Supabase pour ${app.name}`}>Supabase<ArrowUpRight size={13} aria-hidden="true" /></a>}</div>{app.deployedAt && <p>Version en service depuis le {app.deployedAt}</p>}</details>
    </article>)}</div>
    {visible.length === 0 && <div className="ops-directory-empty"><Search size={24} aria-hidden="true" /><h3>{query ? "Aucune application trouvée" : attention ? "Aucune application à vérifier dans cette vue" : "Aucune application dans cet environnement"}</h3><p>{query ? "Essaie un autre nom ou le domaine de l’application." : "Tu peux changer les filtres pour afficher les autres applications."}</p><button type="button" className="ops-button ops-button-secondary" onClick={() => { setSearch(""); setAttention(false); }}>Effacer les filtres</button></div>}
  </section>;
}
