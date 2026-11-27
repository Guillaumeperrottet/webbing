import type { ownerPublicationRules } from "@/lib/gestion/owner-releases";
import { ShieldCheck } from "lucide-react";

export function OwnerPublicationStatus({ rules }: { rules: Awaited<ReturnType<typeof ownerPublicationRules>> }) {
  const active = rules.filter(rule => rule.enabled);
  const exceptions = rules.filter(rule => !rule.enabled || rule.last_error);
  return <section className="ops-panel ops-policy-panel"><div className="ops-policy-heading"><span className="ops-policy-icon"><ShieldCheck size={23} aria-hidden="true" /></span><div><h2>Publication de tes changements</h2><p>{active.length ? "Tes pushes personnels sont publiés après les tests et le build." : "La publication personnelle automatique n’est pas encore activée."}</p></div><span className={`ops-badge ops-state-${active.length ? "disponible" : "unknown"}`}>{active.length} dépôt{active.length > 1 ? "s" : ""} en automatique</span></div>
    <p className="ops-policy-note">Les propositions de dépendances restent à valider manuellement. Le staging garde ses prévisualisations.</p>
    {rules.length > 0 && <details className="ops-policy-details"><summary>Voir les dépôts et les exceptions{exceptions.length > 0 && <span className="ops-badge ops-state-warning">{exceptions.length} à vérifier</span>}</summary><ul className="ops-policy-list">{rules.map(rule => <li key={rule.repository}><div><strong>{rule.repository.split("/")[1]}</strong><span className={`ops-badge ops-state-${rule.enabled ? "disponible" : "unknown"}`}>{rule.enabled ? "Automatique" : "Manuel"}</span></div><span>Branche {rule.branch}</span>{rule.last_error && <p>{rule.last_error}</p>}</li>)}</ul></details>}
  </section>;
}
