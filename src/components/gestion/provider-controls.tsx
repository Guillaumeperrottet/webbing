"use client";
import { useState,useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { addSupabaseConnection, refreshProviders } from "@/app/gestion/actions";

export function SupabaseConnectionForm({projects}:{projects:{ref:string;name:string}[]}) {
  const [busy,setBusy]=useState(false);const [feedback,setFeedback]=useState<{ok:boolean;message:string}|null>(null);const router=useRouter();
  return <form className="ops-form" action={async(form)=>{setBusy(true);setFeedback(null);try{const result=await addSupabaseConnection(form);setFeedback(result);if(result.ok){const field=document.getElementById('supabase-token') as HTMLInputElement|null;if(field)field.value='';router.refresh();}}catch{setFeedback({ok:false,message:'La connexion a échoué. Réessaie dans un instant.'});}finally{setBusy(false);}}}>
    <label>Nom de la connexion<input name="name" maxLength={80} defaultValue="Supabase principal" required /></label>
    <p className="ops-hint">Dans les <a href="https://supabase.com/dashboard/account/tokens" target="_blank" rel="noopener noreferrer">jetons d’accès Supabase</a>, crée un jeton limité aux projets souhaités avec seulement « Project Settings » en lecture. Sa valeur commence par sbp_fc. Il ne nécessite aucun droit d’écriture, de lecture des données ou de facturation.</p>
    <label>Jeton Supabase en lecture seule<input id="supabase-token" name="token" type="password" autoComplete="off" minLength={25} maxLength={2048} required spellCheck={false} /></label>
    <fieldset className="ops-project-picker"><legend>Projets à vérifier</legend>{projects.map((p)=><label className="ops-checkbox" key={p.ref}><input type="checkbox" name="refs" value={p.ref} defaultChecked />{p.name}</label>)}</fieldset>
    <p className="ops-hint">Seuls les projets accessibles avec ce jeton seront raccordés. Tu peux ajouter plusieurs connexions pour tes différents comptes. Le jeton sera chiffré et ne sera plus affiché.</p>
    {feedback&&<p role="status" className={feedback.ok?"ops-feedback":"ops-error"}>{feedback.message}</p>}
    <button className="ops-button ops-button-primary" disabled={busy}>{busy?'Vérification des accès…':'Vérifier et raccorder Supabase'}</button>
  </form>;
}
export function RefreshProviders(){const[pending,start]=useTransition();const[error,setError]=useState('');return <div><button className="ops-button ops-button-secondary" disabled={pending} onClick={()=>start(async()=>{try{setError('');await refreshProviders();}catch{setError('La synchronisation n’a pas abouti. Réessaie dans un instant.');}})}><RefreshCw size={16} aria-hidden="true"/>{pending?'Synchronisation…':'Actualiser les bases'}</button>{error&&<p role="alert" className="ops-error">{error}</p>}</div>;}
