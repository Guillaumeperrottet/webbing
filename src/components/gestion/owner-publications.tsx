import type { ownerPublicationRules } from "@/lib/gestion/owner-releases";

export function OwnerPublicationStatus({ rules }: { rules: Awaited<ReturnType<typeof ownerPublicationRules>> }) {
  const active = rules.filter(rule => rule.enabled);
  return <section className="ops-panel ops-panel-padded"><h2>Publication de tes changements</h2>
    <p>{active.length ? `Les pushes du compte ${active[0].owner_login} sur la branche de production sont publiés après les tests et le build, sans confirmation supplémentaire dans Webbing.` : "La publication personnelle automatique n’est pas encore activée."}</p>
    <p className="ops-hint">Les propositions de dépendances conservent leur validation manuelle. Une version qui contient une proposition Dependabot en attente de publication reste à confirmer ici. Les branches de travail et le staging gardent leurs prévisualisations.</p>
    {rules.length > 0 && <ul className="ops-batch-summary">{rules.map(rule => <li key={rule.repository}><strong>{rule.repository.split("/")[1]} · {rule.enabled ? "Tes pushes : publication automatique" : "Validation manuelle"}</strong><span>Branche : {rule.branch}</span>{rule.last_error && <span>{rule.last_error}</span>}</li>)}</ul>}
  </section>;
}
