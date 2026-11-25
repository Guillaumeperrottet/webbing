"use client";
import { useState, useTransition } from "react";
import { RefreshCw, LogOut } from "lucide-react";
import { authClient } from "@/lib/gestion/client";
import { createCollector, refreshHealth } from "@/app/gestion/actions";

export function Logout() {
  return <button className="ops-text-button" onClick={async () => { await authClient.signOut(); window.location.assign("/gestion/connexion"); }}><LogOut size={17} aria-hidden="true" />Déconnexion</button>;
}
export function Refresh() {
  const [pending, start] = useTransition(); const [error, setError] = useState("");
  return <div><button className="ops-button ops-button-secondary" disabled={pending} onClick={() => start(async () => { try { setError(""); await refreshHealth(); } catch { setError("La vérification a échoué. Réessaie dans un instant."); } })}><RefreshCw size={16} aria-hidden="true" className={pending ? "ops-spinning" : ""} />{pending ? "Vérification…" : "Vérifier maintenant"}</button>{error && <p role="alert" className="ops-error">{error}</p>}</div>;
}
export function CollectorSetup() {
  const [name, setName] = useState("Synology Campus"); const [config, setConfig] = useState(""); const [command, setCommand] = useState(""); const [pending, setPending] = useState(false); const [error, setError] = useState("");
  async function create() {
    setPending(true); setError("");
    try {
      const result = await createCollector(name);
      const json = JSON.stringify(result.config, null, 2);
      setConfig(json);
      const script = await fetch("/api/gestion/agent", { cache: "no-store" });
      if (!script.ok) throw new Error("Script indisponible.");
      const source = await script.text();
      setCommand(`umask 077\nBASE="$HOME/webbing-backups/monitoring"\nmkdir -p "$BASE"\ncat > "$BASE/webbing-synology.py" <<'WEBBING_AGENT_PY'\n${source}\nWEBBING_AGENT_PY\ncat > "$BASE/webbing-synology.json" <<'WEBBING_CONFIG_JSON'\n${json}\nWEBBING_CONFIG_JSON\nchmod 600 "$BASE/webbing-synology.json"\n/usr/bin/env python3 "$BASE/webbing-synology.py" --config "$BASE/webbing-synology.json" >> "$BASE/collecte.log" 2>&1`);
    } catch { setError("Impossible de préparer le raccordement."); } finally { setPending(false); }
  }
  return <div className="ops-collector-setup">
    {!config ? <><label>Nom du collecteur<input value={name} maxLength={80} onChange={(e) => setName(e.target.value)} /></label><button className="ops-button ops-button-primary" disabled={pending || !name.trim()} onClick={create}>{pending ? "Préparation…" : "Préparer le raccordement"}</button></> : <><p>Cette commande contient un accès limité à l’envoi de rapports. Conserve-la de manière privée : la clé ne sera plus affichée ensuite.</p>{command && <><label>Commande pour le planificateur Synology<textarea id="synology-install-command" readOnly value={command} rows={7} spellCheck={false} /></label><button className="ops-button ops-button-primary" onClick={() => navigator.clipboard.writeText(command)}>Copier la commande d’installation</button></>}<button className="ops-button ops-button-secondary" onClick={() => { const url = URL.createObjectURL(new Blob([config], { type: "application/json" })); const a = document.createElement("a"); a.href = url; a.download = "webbing-synology.json"; a.click(); URL.revokeObjectURL(url); }}>Télécharger la configuration privée</button><a className="ops-button ops-button-secondary" href="/api/gestion/agent">Télécharger le script Synology</a><p className="ops-hint">Dans le planificateur Synology, créer un script utilisateur avec ton compte, toutes les 15 minutes. Les dossiers déjà identifiés sont inclus dans la commande.</p></>}
    {error && <p role="alert" className="ops-error">{error}</p>}
  </div>;
}
