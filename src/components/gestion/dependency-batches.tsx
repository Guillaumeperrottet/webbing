"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { prepareTestsBatch, confirmTestsBatch, refreshTestsProgress } from "@/app/gestion/actions";
import type { Repository, DependencyUpdate } from "@/lib/gestion/github";
import { MAX_MANUAL_TESTS, dependencyTestState, testStateLabels, type BatchPreview, type BatchResult } from "@/lib/gestion/dependency-test-state";

const typeLabels: Record<string, string> = { patch: "Correctifs", minor: "Versions mineures", major: "Versions majeures", unknown: "Type à examiner" };

export function DependencyBatchPicker({ repositories, updates, active }: { repositories: Repository[]; updates: DependencyUpdate[]; active: boolean }) {
  const router = useRouter();
  const id = useId();
  const [selection, setSelection] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<BatchPreview | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, start] = useTransition();
  const heading = useRef<HTMLHeadingElement>(null);
  const grouped = new Map<string, DependencyUpdate[]>();
  for (const update of updates) grouped.set(update.repository, [...(grouped.get(update.repository) || []), update]);
  const selected = updates.filter(update => selection[update.repository] === String(update.number));
  const count = selected.length;

  useEffect(() => { if (preview) heading.current?.focus(); }, [preview]);

  if (preview) {
    const privateCount = preview.items.filter(item => item.private).length;
    return <section className="ops-panel ops-panel-padded ops-batch-panel" aria-labelledby={`${id}-confirm`}>
      <h2 id={`${id}-confirm`} tabIndex={-1} ref={heading}>Confirmer ce lot de tests</h2>
      <p><strong>{preview.items.length} exécution(s) GitHub Actions</strong>, avec jusqu’à trois tâches par exécution. Les dépôts privés utilisent le quota ou le budget disponible ; Webbing ne connaît pas ton solde.</p>
      <ul className="ops-batch-summary">{preview.items.map(item => <li key={item.repository}><strong>{item.repository.split("/")[1]} · #{item.number}</strong><span>{typeLabels[item.updateType]} · {item.private ? "Dépôt privé" : "Dépôt public"}</span><span>Version <code>{item.head.slice(0, 7)}</code> · base <code>{item.base.slice(0, 7)}</code></span></li>)}</ul>
      {privateCount > 0 && <p className="ops-notice">{privateCount} dépôt(s) privé(s). Un blocage de quota ou d’accès sera affiché comme tel ; il ne déclenchera aucune relance automatique.</p>}
      <p className="ops-hint">Les versions seront revérifiées au lancement. Cette confirmation expire après 15 minutes. Les tests ne fusionnent aucune proposition et ne publient aucune application.</p>
      <div className="ops-inline-tools"><button className="ops-button ops-button-primary" disabled={pending} onClick={() => start(async () => {
        try {
          const form = new FormData(); form.set("batch", preview.id);
          const result = await confirmTestsBatch(form); setFeedback(result);
          if (result.ok) { setPreview(null); setSelection({}); router.refresh(); }
        } catch { setFeedback({ ok: false, message: "La confirmation n’a pas abouti. Vérifie le suivi avant de préparer un autre lot." }); }
      })}>{pending ? "Envoi des demandes…" : `Confirmer ${preview.items.length} exécution(s)`}</button><button type="button" className="ops-button ops-button-secondary" disabled={pending} onClick={() => { setPreview(null); setFeedback(null); }}>Revenir à la sélection</button></div>
      {feedback && <p role={feedback.ok ? "status" : "alert"} className={feedback.ok ? "ops-feedback" : "ops-error"}>{feedback.message}</p>}
    </section>;
  }

  return <section className="ops-panel ops-panel-padded ops-batch-panel" aria-labelledby={`${id}-title`}>
    <h2 id={`${id}-title`}>Ton lot de la semaine</h2>
    <p id={`${id}-hint`}>Choisis jusqu’à {MAX_MANUAL_TESTS} dépôts, une proposition par dépôt. Rien ne démarre avant le récapitulatif et ta confirmation.</p>
    {active && <p className="ops-notice">Un lot est déjà en cours. Son résultat apparaît juste en dessous.</p>}
    <fieldset className="ops-batch-picker" disabled={pending || active} aria-describedby={`${id}-hint`}><legend className="ops-sr-only">Propositions à tester</legend>
      {[...grouped].sort(([left], [right]) => left.localeCompare(right)).map(([repository, proposals], index) => {
        const repo = repositories.find(item => item.full_name === repository);
        const connected = !!repo?.integration_id && !repo.last_error;
        const busy = proposals.some(update => dependencyTestState(update) === "pending" || update.approval_status === "requested");
        return <div className="ops-batch-choice" key={repository}><label htmlFor={`${id}-${index}`}>{repository.split("/")[1]}{(!connected || busy) && <small>{busy ? "Une opération est en cours" : "Accès GitHub à vérifier"}</small>}</label><select id={`${id}-${index}`} value={selection[repository] || ""} disabled={!connected || busy || count >= MAX_MANUAL_TESTS && !selection[repository]} onChange={event => { setSelection(previous => ({ ...previous, [repository]: event.target.value })); setFeedback(null); }}>
          <option value="">Ne pas inclure</option>{proposals.map(update => <option key={update.number} value={update.number}>#{update.number} · {typeLabels[update.update_type]} · {testStateLabels[dependencyTestState(update)]}</option>)}
        </select></div>;
      })}
      {grouped.size === 0 && <p className="ops-hint">Aucune proposition ouverte pour le moment.</p>}
    </fieldset>
    <div className="ops-inline-tools"><span className="ops-muted" aria-live="polite">{count} / {MAX_MANUAL_TESTS} dépôt(s) sélectionné(s)</span><button className="ops-button ops-button-primary" disabled={pending || active || count === 0} onClick={() => start(async () => {
      try {
        const form = new FormData(); form.set("selection", JSON.stringify(selected.map(update => ({ repository: update.repository, number: update.number, head: update.head_sha, base: update.base_sha }))));
        const result = await prepareTestsBatch(form);
        if (result.ok) { setPreview(result.preview); setFeedback(null); }
        else { setFeedback(result); router.refresh(); }
      } catch { setFeedback({ ok: false, message: "Le lot n’a pas pu être préparé. Aucune exécution n’a été demandée." }); }
    })}>{pending ? "Vérification des versions…" : "Préparer ce lot"}</button></div>
    {feedback && <p role={feedback.ok ? "status" : "alert"} className={feedback.ok ? "ops-feedback" : "ops-error"}>{feedback.message}</p>}
  </section>;
}

export function DependencyProgressRefresh({ active }: { active: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  useEffect(() => {
    if (!active) return;
    let stopped = false, busy = false;
    const timer = window.setInterval(async () => {
      if (busy || document.visibilityState !== "visible") return;
      busy = true;
      try { await refreshTestsProgress(); if (!stopped) { setError(""); router.refresh(); } }
      catch { if (!stopped) setError("Le suivi n’a pas pu être actualisé. Tu peux consulter les journaux GitHub ou réessayer."); }
      finally { busy = false; }
    }, 30_000);
    return () => { stopped = true; window.clearInterval(timer); };
  }, [active, router]);
  if (!active) return null;
  return <p role="status" className={error ? "ops-error" : "ops-hint"}>{error || "Résultats actualisés toutes les 30 secondes pendant les tests, tant que cette page reste visible."}</p>;
}

export function DependencyBatchHistory({ batches }: { batches: BatchResult[] }) {
  if (!batches.length) return null;
  return <section className="ops-panel"><div className="ops-panel-heading"><h2>Derniers lots confirmés</h2></div><div className="ops-batch-history">{batches.map(batch => <div key={batch.id}>
    <div className="ops-inline-tools"><strong>{new Date(batch.requestedAt).toLocaleString("fr-CH", { timeZone: "Europe/Zurich", dateStyle: "short", timeStyle: "short" })}</strong><span className={`ops-badge ops-state-${batch.status === "completed" ? "disponible" : batch.status === "failed" ? "warning" : "unknown"}`}>{batch.status === "completed" ? "Tests terminés" : batch.status === "failed" ? "À examiner" : "En cours"}</span></div>
    {batch.error && <p className="ops-error">{batch.error}</p>}
    <ul>{batch.items.map(item => <li key={item.requestId}><strong>{item.repository.split("/")[1]} · #{item.number}</strong><span>{item.status === "success" ? "Exécution réussie" : item.status === "failed" ? item.failureKind === "not_started" || item.failureKind === "dispatch_refused" || item.failureKind === "preflight" || item.failureKind === "missing_run" ? "Tests non démarrés" : "Contrôles échoués" : item.status === "running" ? "Tests en cours" : "Démarrage à confirmer"}</span>{item.error && <p className="ops-hint">{item.error}</p>}{item.runUrl && <a href={item.runUrl} target="_blank" rel="noopener noreferrer">Voir le journal GitHub</a>}</li>)}</ul>
  </div>)}</div></section>;
}
