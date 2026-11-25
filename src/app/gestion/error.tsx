"use client";
export default function ErrorPage({ reset }: { reset: () => void }) { return <section className="ops-auth-card"><h1>La gestion est momentanément indisponible.</h1><p>Réessaie dans un instant. Aucun accès n’est accordé tant que la vérification de connexion n’a pas abouti.</p><button className="ops-button ops-button-primary" onClick={reset}>Réessayer</button></section>; }
