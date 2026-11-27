"use client";

import { useId, useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";

export type SearchableRow = { id: string; search: string; environment: string; tags: string[]; cells: ReactNode[] };
const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr");

export function SearchableTable({ title, description, columns, rows, filters = [], initialFilter = "all", stagingLabel = "Staging", action }: {
  title: string; description?: string; columns: string[]; rows: SearchableRow[];
  filters?: { key: string; label: string }[]; initialFilter?: string; stagingLabel?: string; action?: ReactNode;
}) {
  const id = useId();
  const [search, setSearch] = useState("");
  const [scope, setScope] = useState("production");
  const [filter, setFilter] = useState(() => rows.some(row => row.tags.includes(initialFilter)) ? initialFilter : "all");
  const term = normalize(search.trim());
  const visible = rows.filter(row => (scope === "all" || row.environment === scope) && (filter === "all" || row.tags.includes(filter)) && normalize(row.search).includes(term));
  const reset = () => { setSearch(""); setFilter("all"); setScope("production"); };

  return <section className="ops-panel ops-filtered-panel" aria-labelledby={`${id}-title`}>
    <div className="ops-panel-heading"><div><h2 id={`${id}-title`}>{title}</h2>{description && <p className="ops-hint">{description}</p>}</div>{action}</div>
    <div className="ops-table-toolbar"><div className="ops-search"><Search size={18} aria-hidden="true" /><label className="ops-sr-only" htmlFor={`${id}-search`}>Rechercher dans {title.toLocaleLowerCase("fr")}</label><input type="search" id={`${id}-search`} placeholder="Rechercher une application…" value={search} onChange={event => setSearch(event.target.value)} />{search && <button type="button" aria-label="Effacer la recherche" onClick={() => setSearch("")}><X size={16} aria-hidden="true" /></button>}</div>
      <label className="ops-filter-select"><span className="ops-sr-only">Environnement des applications</span><select value={scope} onChange={event => setScope(event.target.value)}><option value="production">Production</option><option value="staging">{stagingLabel}</option><option value="all">Tous les environnements</option></select></label>
      {filters.length > 0 && <label className="ops-filter-select"><span className="ops-sr-only">Afficher les états</span><select value={filter} onChange={event => setFilter(event.target.value)}><option value="all">Tous les états</option>{filters.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}</select></label>}
    </div>
    <p className="ops-results-count" role="status">{visible.length} résultat{visible.length > 1 ? "s" : ""}{scope === "production" ? " en production" : scope === "staging" ? ` · ${stagingLabel.toLocaleLowerCase("fr")}` : ""}</p>
    {visible.length ? <div className="ops-table-scroll"><table className="ops-table ops-responsive-table" role="table"><thead role="rowgroup"><tr role="row">{columns.map(column => <th role="columnheader" scope="col" key={column}>{column}</th>)}</tr></thead><tbody role="rowgroup">{visible.map(row => <tr role="row" key={row.id}>{row.cells.map((cell, index) => <td role="cell" key={columns[index]}><span className="ops-cell-label" aria-hidden="true">{columns[index]}</span><div className="ops-cell-value">{cell}</div></td>)}</tr>)}</tbody></table></div> : <div className="ops-directory-empty"><Search size={23} aria-hidden="true" /><h3>Aucun résultat dans cette vue</h3><p>Essaie un autre nom ou change les filtres.</p><button className="ops-button ops-button-secondary" type="button" onClick={reset}>Réinitialiser les filtres</button></div>}
  </section>;
}
