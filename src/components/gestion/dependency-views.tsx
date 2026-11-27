import Link from 'next/link';
import {GitPullRequestArrow,ExternalLink,Search,ChevronRight} from 'lucide-react';
import type {Repository,DependencyUpdate} from '@/lib/gestion/github';
import type {Integration} from '@/lib/gestion/providers';
import {disconnectGitHub} from '@/app/gestion/actions';
import {GitHubConnectionForm,RefreshDependencies,ApproveDependency,LaunchDependencyTests} from './dependency-controls';
import {DependencyBatchPicker,DependencyProgressRefresh,DependencyBatchHistory} from './dependency-batches';
import {dependencyTestState,testStateLabels,type BatchResult} from '@/lib/gestion/dependency-test-state';
function date(value:string|null){return value?new Date(value).toLocaleString('fr-CH',{timeZone:'Europe/Zurich',dateStyle:'short',timeStyle:'short'}):'Pas encore synchronisé';}
const kinds:Record<string,string>={major:'Version majeure',minor:'Version mineure',patch:'Correctif',unknown:'À examiner'};
export function DependencyView({ repositories, updates, filter = 'all', page = 1, batches = [], repository = '', search = '' }: {
 repositories: Repository[]; updates: DependencyUpdate[]; filter?: string; page?: number; batches?: BatchResult[]; repository?: string; search?: string;
}) {
 const filters = [['all','Toutes'],['untested','À tester'],['major','Majeures'],['unknown','À examiner'],['ready','Prêtes à valider'],['pending','En cours'],['failed','Échecs'],['not_started','Non démarrées'],['stale','À retester']];
 const selected = filters.some(([key]) => key === filter) ? filter : 'all';
 const selectedRepository = repositories.some(repo => repo.full_name === repository) ? repository : '';
 const term = search.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr');
 const pool = updates.filter(update => (!selectedRepository || update.repository === selectedRepository) && `${update.title} ${update.repository} ${update.dependencies.map(d => d.name).join(' ')}`.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr').includes(term));
 const matches = (update: DependencyUpdate, key: string) => key === 'all' || key === 'ready' && update.ready || key === update.update_type || key === dependencyTestState(update);
 const filtered = pool.filter(update => matches(update, selected));
 const totalPages = Math.max(1, Math.ceil(filtered.length / 12));
 const currentPage = Math.min(totalPages, Number.isSafeInteger(page) && page > 0 ? page : 1);
 const visible = filtered.slice((currentPage - 1) * 12, currentPage * 12);
 const href = (key = selected, target = 1) => {
  const params = new URLSearchParams({ vue: 'dependances', filtre: key });
  if (selectedRepository) params.set('depot', selectedRepository);
  if (search.trim()) params.set('recherche', search.trim());
  if (target > 1) params.set('page', String(target));
  return `/gestion?${params}`;
 };
 const active = batches.some(batch => batch.status === 'running' || batch.status === 'checking');
 const pending = active || updates.some(update => dependencyTestState(update) === 'pending');
 const connected = repositories.filter(r => r.integration_id && !r.last_error).length;
 return <>
  <div className="ops-inline-tools ops-view-tools"><p className="ops-notice">Les tests et les validations se lancent à ta demande. Choisis une proposition, vérifie ses changements, puis prépare ton lot.</p><RefreshDependencies /></div>
  {connected === 0 && <section className="ops-callout"><GitPullRequestArrow size={26} aria-hidden="true" /><div><h2>Raccorder GitHub</h2><p>Ajoute l’accès dédié pour suivre les propositions et les valider ici.</p><Link href="/gestion?vue=connexions">Raccorder GitHub</Link></div></section>}
  <div className="ops-stats ops-stats-three"><div><span>Propositions ouvertes</span><strong>{updates.length}</strong><small>{connected} / {repositories.length} dépôts raccordés</small></div><div><span>Versions majeures</span><strong>{updates.filter(update => update.update_type === 'major').length}</strong><small>À valider personnellement</small></div><div><span>Prêtes à valider</span><strong>{updates.filter(update => update.ready).length}</strong><small>Après réussite des contrôles</small></div></div>
  <details className="ops-panel ops-disclosure ops-batch-disclosure" open={active}><summary><div><strong>Préparer un lot de tests</strong><span>Jusqu’à 3 dépôts · lancement après confirmation</span></div><span className={`ops-badge ops-state-${active ? 'warning' : 'unknown'}`}>{active ? 'Lot en cours' : 'À la demande'}</span></summary><div className="ops-disclosure-body"><DependencyBatchPicker key={`${selectedRepository}:${search}`} repositories={repositories} updates={pool} active={active} /></div></details>
  <DependencyProgressRefresh active={pending} />
  {batches.length > 0 && <details className="ops-panel ops-disclosure" open={active}><summary><div><strong>Derniers lots confirmés</strong><span>Résultats et journaux des exécutions précédentes</span></div></summary><div className="ops-disclosure-body"><DependencyBatchHistory batches={batches} /></div></details>}
  <section className="ops-panel ops-update-filters" aria-label="Rechercher et filtrer les mises à jour">
   <form method="get" action="/gestion" className="ops-table-toolbar"><input type="hidden" name="vue" value="dependances" /><input type="hidden" name="filtre" value={selected} />
    <div className="ops-search"><Search size={18} aria-hidden="true" /><label className="ops-sr-only" htmlFor="ops-update-search">Rechercher une mise à jour</label><input type="search" name="recherche" id="ops-update-search" defaultValue={search} placeholder="Nom du paquet ou de l’application…" /></div>
    <label className="ops-filter-select"><span className="ops-sr-only">Dépôt des mises à jour</span><select name="depot" defaultValue={selectedRepository}><option value="">Tous les dépôts</option>{repositories.map(repo => <option key={repo.full_name} value={repo.full_name}>{repo.full_name.split('/')[1]}</option>)}</select></label>
    <button className="ops-button ops-button-secondary">Filtrer</button>{(selectedRepository || search.trim()) && <Link className="ops-clear-filters" href="/gestion?vue=dependances">Effacer</Link>}
   </form>
   <nav className="ops-filter-chips" aria-label="État des mises à jour">{filters.map(([key,label]) => <Link className="ops-filter-chip" aria-current={selected === key ? 'page' : undefined} href={href(key)} key={key}>{label}<span>{pool.filter(update => matches(update,key)).length}</span></Link>)}</nav>
  </section>
  <div className="ops-list-heading"><h2>Propositions{selectedRepository ? ` · ${selectedRepository.split('/')[1]}` : ''}</h2><span role="status">{filtered.length} résultat{filtered.length > 1 ? 's' : ''}{totalPages > 1 ? ` · page ${currentPage} / ${totalPages}` : ''}</span></div>
  {visible.map(update => {
   const repo = repositories.find(r => r.full_name === update.repository), automatic = update.auto_eligible && repo?.auto_merge_enabled, state = dependencyTestState(update);
   return <details className="ops-panel ops-update ops-update-disclosure" key={`${update.repository}:${update.number}`} open={update.ready}>
    <summary><span className="ops-app-initial" aria-hidden="true">{update.repository.split('/')[1][0].toUpperCase()}</span><div className="ops-update-summary-text"><strong>{update.repository.split('/')[1]}<span>#{update.number}</span></strong><p>{update.title}</p></div><div className="ops-update-summary-badges"><span className={`ops-badge ops-state-${update.update_type === 'major' ? 'warning' : 'unknown'}`}>{kinds[update.update_type] || 'À examiner'}</span><span className={`ops-badge ops-state-${state === 'passed' ? 'disponible' : state === 'failed' ? 'incident' : state === 'not_started' || state === 'stale' ? 'warning' : 'unknown'}`}>{testStateLabels[state]}</span></div><ChevronRight className="ops-disclosure-chevron" size={18} aria-hidden="true" /></summary>
    <div className="ops-update-body"><h2>{update.title}</h2><p>{update.dependencies.map(d => `${d.name}${d.version ? ` → ${d.version}` : ''}`).join(' · ') || 'Les détails sont à examiner dans GitHub.'}</p><p className={update.ready ? 'ops-feedback' : 'ops-hint'}>{update.reason}</p>
     <div className="ops-service-row">{update.checks.map((check,index) => <span key={`${check.name}:${index}`} className={`ops-badge ops-state-${check.conclusion === 'success' ? 'disponible' : check.conclusion === 'failure' ? 'incident' : 'unknown'}`}>{check.url ? <a href={check.url} target="_blank" rel="noopener noreferrer">{check.name} · {check.conclusion || check.status}</a> : <>{check.name} · {check.conclusion || check.status}</>}</span>)}</div>
     <p className="ops-hint">Dernier contrôle : {date(update.checked_at)} · version {update.head_sha.slice(0,7)}</p>
     <div className="ops-update-actions"><a className="ops-button ops-button-secondary" href={update.url} target="_blank" rel="noopener noreferrer">Voir les changements<ExternalLink size={14} aria-hidden="true" /></a>{!repo?.integration_id ? <Link href="/gestion?vue=connexions">Raccorder GitHub</Link> : automatic ? <span className="ops-muted">Fusion automatique après réussite des contrôles</span> : <><LaunchDependencyTests update={update} /><ApproveDependency update={update} /></>}</div>
    </div>
   </details>;
  })}
  {filtered.length === 0 && <section className="ops-directory-empty"><Search size={24} aria-hidden="true" /><h2>Aucune proposition dans cette vue</h2><p>{connected ? 'Change les filtres pour retrouver les autres propositions.' : 'Les propositions apparaîtront après le raccordement GitHub.'}</p><Link className="ops-button ops-button-secondary" href="/gestion?vue=dependances">Voir toutes les propositions</Link></section>}
  {totalPages > 1 && <nav className="ops-pagination" aria-label="Pages des mises à jour">{currentPage > 1 ? <Link className="ops-button ops-button-secondary" href={href(selected,currentPage - 1)}>Précédent</Link> : <span />}<span>Page {currentPage} sur {totalPages}</span>{currentPage < totalPages ? <Link className="ops-button ops-button-secondary" href={href(selected,currentPage + 1)}>Suivant</Link> : <span />}</nav>}
  <details className="ops-panel ops-disclosure"><summary><div><strong>Configuration des dépôts</strong><span>Accès GitHub, contrôles et dernière synchronisation</span></div><span className="ops-section-count">{repositories.length}</span></summary><div className="ops-table-scroll"><table className="ops-table"><thead><tr><th>Dépôt</th><th>Contrôles</th><th>Mises à jour</th><th>Synchronisation</th></tr></thead><tbody>{repositories.map(repo => <tr key={repo.full_name}><td><strong>{repo.full_name.split('/')[1]}</strong>{repo.last_error && <span className="ops-error">{repo.last_error}</span>}</td><td>{repo.setup_pr_url && repo.setup_state !== 'installed' && <a href={repo.setup_pr_url} target="_blank" rel="noopener noreferrer">Voir l’installation</a>}{repo.ci_configured ? 'Configurés' : 'Installation en cours'}</td><td>{repo.auto_merge_enabled ? 'Automatiques si les contrôles passent' : repo.setup_state === 'installed' ? 'Tests et validation manuels' : 'Installation en cours'}</td><td>{date(repo.last_sync_at)}</td></tr>)}</tbody></table></div></details>
 </>;
}
export function GitHubConnections({repositories,connections}:{repositories:Repository[];connections:Integration[]}){return <><section className="ops-panel ops-panel-padded"><GitPullRequestArrow size={25} aria-hidden="true"/><h2>Raccorder les mises à jour GitHub</h2><GitHubConnectionForm repositories={repositories}/></section><section className="ops-panel ops-panel-padded"><h2>Accès GitHub de Webbing</h2>{connections.filter(c=>c.provider==='github').map(c=><div className="ops-collector-row" key={c.id}><strong>{c.name}</strong><p>{repositories.filter(r=>r.integration_id===c.id).map(r=>r.full_name.split('/')[1]).join(', ')}</p><p className="ops-hint">Dernière synchronisation : {date(c.last_sync_at)}</p>{c.last_error&&<p className="ops-error">{c.last_error}</p>}<form action={disconnectGitHub}><input type="hidden" name="id" value={c.id}/><button className="ops-button ops-button-secondary">Retirer l’accès de Webbing</button></form></div>)}</section></>;}
