"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { confirmPublication, disconnectPublication, preparePublication, refreshPublications } from "@/app/gestion/actions";
import { releaseLabels, type ReleaseConnection, type ReleaseHistory, type ReleasePreview } from "@/lib/gestion/release-state";

export function PublicationPanel({ connections, history }: { connections: ReleaseConnection[]; history: ReleaseHistory[] }) {
  const id = useId(), router = useRouter();
  const [project, setProject] = useState("");
  const [preview, setPreview] = useState<ReleasePreview | null>(null);
  const [reviewed, setReviewed] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, start] = useTransition();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (preview) heading.current?.focus(); }, [preview]);
  const active = new Set(history.filter(row => ["checking", "publishing", "safety_error"].includes(row.status)).map(row => row.proof.projectId));
  return <>
    <section className="ops-panel ops-panel-padded ops-batch-panel" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>Publier une version</h2>
      {!preview ? <>
        <p>Choisis une application pour vérifier sa version prête à publier. Le récapitulatif précède la confirmation et un nouveau contrôle 2FA.</p>
        <form action={form => start(async () => {
          try { const result = await preparePublication(form); if (result.ok) { setPreview(result.preview); setReviewed(false); setFeedback(null); } else setFeedback(result); }
          catch { setFeedback({ ok: false, message: "La vérification n’a pas abouti. Actualise le suivi et réessaie." }); }
        })}>
          <label htmlFor={`${id}-project`}>Application à publier</label>
          <select name="project" id={`${id}-project`} required value={project} disabled={pending} onChange={event => { setProject(event.target.value); setFeedback(null); }}>
            <option value="">Choisir une application</option>
            {connections.map(connection => <option key={connection.project_id} value={connection.project_id} disabled={new Date(connection.expires_at).getTime() <= Date.now() || active.has(connection.project_id)}>{connection.name}{active.has(connection.project_id) ? " · suivi à vérifier" : new Date(connection.expires_at).getTime() <= Date.now() ? " · accès expiré" : ""}</option>)}
          </select>
          <button className="ops-button ops-button-primary" disabled={pending || !project}>{pending ? "Vérification de la version…" : "Préparer la publication"}</button>
        </form>
        {!connections.length && <p className="ops-notice">L’accès Vercel de publication doit être raccordé dans <Link href="/gestion?vue=connexions">Connexions</Link>.</p>}
      </> : <>
        <h3 tabIndex={-1} ref={heading}>Confirmer la mise en ligne de {preview.name}</h3>
        <dl className="ops-release-summary"><div><dt>Version à publier</dt><dd><code>{preview.sha}</code></dd></div><div><dt>Version remplacée</dt><dd><code>{preview.previousSha}</code></dd></div><div><dt>Domaines concernés</dt><dd>{preview.domains.join(", ")}</dd></div></dl>
        <p><a href={preview.url} target="_blank" rel="noopener noreferrer">Vérifier ce build</a> · <a href={preview.pullUrl} target="_blank" rel="noopener noreferrer">Changements de la PR</a> · <a href={preview.runUrl} target="_blank" rel="noopener noreferrer">Contrôles réussis</a></p>
        <p className="ops-hint">Cette confirmation expire à {new Date(preview.expiresAt).toLocaleTimeString("fr-CH", { timeZone: "Europe/Zurich", hour: "2-digit", minute: "2-digit" })}. La version et les domaines seront revérifiés avant l’envoi.</p>
        <form action={form => start(async () => {
          try {
            form.set("release", preview.id);
            const result = await confirmPublication(form); setFeedback(result);
            // Do not keep a 2FA code in React state, localStorage or the URL.
            if (result.ok) { setPreview(null); router.refresh(); }
          } catch { setPreview(null); setFeedback({ ok: false, message: "La réponse est incertaine. Actualise le suivi avant toute nouvelle demande de publication." }); router.refresh(); }
        })}>
          <fieldset disabled={pending} className="ops-release-confirm"><legend className="ops-sr-only">Confirmation de publication</legend>
            <label className="ops-release-checkbox"><input type="checkbox" name="reviewed" value="yes" required checked={reviewed} onChange={event => setReviewed(event.target.checked)}/> J’ai vérifié les changements, les parcours importants et la compatibilité avec les données en production.</label>
            <label htmlFor={`${id}-code`}>Code 2FA de ton application d’authentification</label>
            <input id={`${id}-code`} name="code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" minLength={6} maxLength={6} required aria-describedby={`${id}-code-hint`} />
            <p className="ops-hint" id={`${id}-code-hint`}>Un code à six chiffres est exigé pour cette publication, même si ta session est déjà ouverte.</p>
            <div className="ops-inline-tools"><button className="ops-button ops-button-primary">{pending ? "Confirmation et mise en ligne…" : `Confirmer et publier ${preview.name}`}</button><button type="button" className="ops-button ops-button-secondary" onClick={() => { setPreview(null); setFeedback(null); }}>Annuler</button></div>
          </fieldset>
        </form>
      </>}
      {feedback && <p role={feedback.ok ? "status" : "alert"} className={feedback.ok ? "ops-feedback" : "ops-error"}>{feedback.message}</p>}
    </section>
    {history.length > 0 && <section className="ops-panel ops-panel-padded"><div className="ops-panel-heading"><h2>Suivi des publications</h2><button className="ops-button ops-button-secondary" disabled={pending} onClick={() => start(async () => { try { await refreshPublications(); router.refresh(); } catch { setFeedback({ ok: false, message: "Le suivi n’a pas pu être actualisé. Aucun nouvel envoi de publication." }); } })}>Actualiser le suivi</button></div>
      <p className="ops-hint">Une demande en attente n’est jamais renvoyée automatiquement. « En ligne » confirme la version servie par les domaines au moment du contrôle.</p>
      <ul className="ops-batch-summary">{history.map(row => <li key={row.id}><strong>{row.proof.name} · {releaseLabels[row.status] || row.status}</strong><span>Révision <code>{row.proof.sha.slice(0, 7)}</code> · {new Date(row.requestedAt).toLocaleString("fr-CH", { timeZone: "Europe/Zurich" })}</span>{row.error && <span role="alert">{row.error}</span>}</li>)}</ul>
    </section>}
  </>;
}

export function PublicationConnections({ connections }: { connections: ReleaseConnection[] }) {
  return <section className="ops-panel ops-panel-padded"><h2>Publications Vercel</h2><p>Un accès chiffré et limité à chaque projet autorise sa publication après confirmation et contrôle 2FA. Les événements signés restent séparés.</p>
    {!connections.length ? <p className="ops-notice">Aucun projet raccordé pour la publication.</p> : connections.map(connection => <div className="ops-collector-row" key={connection.project_id}><strong>{connection.name}</strong><p>Accès valable jusqu’au {new Date(connection.expires_at).toLocaleDateString("fr-CH", { timeZone: "Europe/Zurich" })}.</p><form action={disconnectPublication}><input type="hidden" name="project" value={connection.project_id}/><button className="ops-button ops-button-secondary">Retirer l’accès de publication</button></form></div>)}
    <p className="ops-hint">Le retrait est suspendu pendant une publication en cours. Le renouvellement se fait par le propriétaire dans Vercel, sans transmettre de clé dans le chat.</p>
  </section>;
}
