"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { LockKeyhole, ShieldCheck, KeyRound } from "lucide-react";
import { authClient } from "@/lib/gestion/client";

type Mode = "login" | "activate" | "enroll" | "challenge";
export function AuthForm({ mode, email }: { mode: Mode; email: string }) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [backup, setBackup] = useState(false);
  const [saved, setSaved] = useState(false);
  const [token, setToken] = useState("");
  const [enrollment, setEnrollment] = useState<{ qr: string; codes: string[] } | null>(null);

  useEffect(() => {
    if (mode !== "activate") return;
    const invitation = new URLSearchParams(window.location.hash.slice(1)).get("invitation");
    if (invitation) {
      setToken(invitation);
      window.history.replaceState(null, "", window.location.pathname);
    } else setError("Ouvre le lien personnel reçu par e-mail pour activer ton compte.");
  }, [mode]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      if (mode === "activate") {
        if (password !== confirmation) throw new Error("Les mots de passe ne correspondent pas.");
        const response = await fetch("/api/gestion/activation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || result.message || "L’activation a échoué.");
        window.location.assign("/gestion/securite"); return;
      }
      if (mode === "login") {
        const result = await authClient.signIn.email({ email, password, rememberMe: false });
        if (result.error) throw new Error("Connexion refusée. Vérifie ton mot de passe ou réessaie dans une minute.");
        window.location.assign(result.data && "twoFactorRedirect" in result.data && result.data.twoFactorRedirect ? "/gestion/verification" : "/gestion/securite"); return;
      }
      if (mode === "enroll" && !enrollment) {
        const result = await authClient.twoFactor.enable({ password, method: "totp" });
        if (result.error || !result.data || !("totpURI" in result.data)) throw new Error("Impossible de préparer la double authentification. Vérifie ton mot de passe.");
        const qr = await QRCode.toDataURL(result.data.totpURI, { width: 240, margin: 2, errorCorrectionLevel: "M" });
        setEnrollment({ qr, codes: result.data.backupCodes }); setPassword(""); return;
      }
      const result = backup && mode === "challenge"
        ? await authClient.twoFactor.verifyBackupCode({ code, trustDevice: false })
        : await authClient.twoFactor.verifyTotp({ code, trustDevice: false });
      if (result.error) throw new Error("Code refusé ou expiré. Réessaie avec un nouveau code.");
      window.location.assign("/gestion");
    } catch (e) { setError(e instanceof Error ? e.message : "La connexion est indisponible. Réessaie dans un instant."); }
    finally { setBusy(false); }
  }

  const titles = { login: "Ton espace de gestion.", activate: "Bienvenue dans ta gestion.", enroll: "Protège ton accès.", challenge: "Confirme que c’est toi." };
  const descriptions = {
    login: "Connecte-toi pour retrouver tes applications et leurs sauvegardes.",
    activate: "Choisis ton mot de passe. Tu activeras ensuite la double authentification.",
    enroll: "Associe une application d’authentification avant d’accéder à tes données.",
    challenge: "Saisis le code de ton application d’authentification pour ouvrir cette session.",
  };
  return <div className="ops-auth-wrap"><section className="ops-auth-card" aria-labelledby="auth-title">
    <Link href="/" className="ops-wordmark">webbing<span>gestion</span></Link>
    <div className="ops-auth-symbol"><LockKeyhole size={25} aria-hidden="true" /></div>
    <p className="ops-eyebrow">ESPACE PRIVÉ</p>
    <h1 id="auth-title">{titles[mode]}</h1><p className="ops-lead">{descriptions[mode]}</p>
    <form onSubmit={submit} className="ops-form">
      {(mode === "login" || mode === "activate") && <label>Adresse e-mail<input type="email" autoComplete="username" readOnly value={email} /></label>}
      {(mode === "login" || mode === "activate" || (mode === "enroll" && !enrollment)) && <label>{mode === "activate" ? "Choisis un mot de passe" : "Mot de passe"}<input type="password" required minLength={mode === "activate" ? 14 : 1} maxLength={128} autoComplete={mode === "activate" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} />{mode === "activate" && <span className="ops-hint">Au moins 14 caractères. Une phrase longue fonctionne bien.</span>}</label>}
      {mode === "activate" && <label>Confirme le mot de passe<input type="password" required autoComplete="new-password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} /></label>}
      {enrollment && <div className="ops-enrollment">
        <p>Scanne ce QR code dans ton application d’authentification.</p>
        {/* eslint-disable-next-line @next/next/no-img-element -- QR generated locally; no third-party request. */}
        <img src={enrollment.qr} alt="QR code à scanner dans ton application d’authentification" width={240} height={240} />
        <h2>Conserve tes codes de secours</h2><p className="ops-hint">Chaque code fonctionne une seule fois si tu perds l’accès à ton téléphone.</p>
        <div className="ops-backup-codes">{enrollment.codes.map((item) => <code key={item}>{item}</code>)}</div>
        <button type="button" className="ops-button ops-button-secondary" onClick={() => {
          const blob = new Blob(["Webbing Gestion — codes de secours\n\n" + enrollment.codes.join("\n")], { type: "text/plain" });
          const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "webbing-codes-de-secours.txt"; a.click(); URL.revokeObjectURL(url);
        }}>Télécharger les codes</button>
        <label className="ops-checkbox"><input type="checkbox" checked={saved} onChange={(e) => setSaved(e.target.checked)} required /> J’ai conservé mes codes dans un endroit sûr.</label>
      </div>}
      {(mode === "challenge" || enrollment) && <label>{backup ? "Code de secours" : "Code à 6 chiffres"}<input autoComplete="one-time-code" inputMode={backup ? "text" : "numeric"} pattern={backup ? undefined : "[0-9]{6}"} maxLength={backup ? 30 : 6} required value={code} onChange={(e) => setCode(backup ? e.target.value : e.target.value.replace(/\D/g, ""))} className="ops-code-input" /></label>}
      {error && <p role="alert" className="ops-error">{error}</p>}
      <button className="ops-button ops-button-primary" disabled={busy || (mode === "activate" && !token) || (!!enrollment && !saved)} type="submit">{busy ? "Vérification…" : mode === "activate" ? "Créer mon accès" : mode === "enroll" && !enrollment ? "Préparer mon authentification" : mode === "challenge" || enrollment ? "Vérifier et ouvrir la gestion" : "Se connecter"}</button>
    </form>
    {mode === "challenge" && <button className="ops-text-button" type="button" onClick={() => { setBackup(!backup); setCode(""); setError(""); }}><KeyRound size={16} aria-hidden="true" />{backup ? "Utiliser mon application d’authentification" : "Utiliser un code de secours"}</button>}
    {mode !== "login" && <button className="ops-text-button" onClick={async () => { await authClient.signOut(); window.location.assign("/gestion/connexion"); }}>Revenir à la connexion</button>}
    <div className="ops-auth-footer"><ShieldCheck size={17} aria-hidden="true" /> Double authentification obligatoire</div>
  </section><p className="ops-auth-caption">Tes applications. Leur état. Un seul endroit.</p></div>;
}
