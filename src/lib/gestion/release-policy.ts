import { PublicationError } from "./release-state";

const sha = /^[a-f0-9]{40}$/;
export type ExpectedProject = { id: string; name: string; repository: string };
export type VercelDeployment = { id: string; projectId?: string; name?: string; target?: string; readyState?: string; readySubstate?: string; url?: string; meta?: Record<string, string> };
export type VercelProject = { id: string; accountId?: string; name: string; autoAssignCustomDomains?: boolean; link?: { type?: string; org?: string; repo?: string; productionBranch?: string }; targets?: { production?: VercelDeployment }; };
export function demand(condition: unknown, message: string): asserts condition { if (!condition) throw new PublicationError(message); }
export function validateProject(project: VercelProject, expected: ExpectedProject, owner: string, teamId: string) {
  demand(project.id === expected.id && project.name === expected.name && project.accountId === teamId, "Projet ou équipe Vercel incorrects.");
  demand(project.link?.type === "github" && project.link.org === owner && project.link.repo === expected.repository, "Le projet ne correspond pas au dépôt GitHub autorisé.");
  demand(project.autoAssignCustomDomains === false, "La promotion automatique doit être désactivée dans Vercel avant toute publication.");
  demand(project.targets?.production?.id && project.targets.production.readyState === "READY", "La version actuellement en service ne peut pas être vérifiée.");
}
export function validateDeployment(deployment: VercelDeployment, expected: ExpectedProject, owner: string) {
  demand(/^dpl_[A-Za-z0-9]+$/.test(deployment.id) && deployment.projectId === expected.id && deployment.target === "production" && deployment.readyState === "READY", "Choisis un build de production prêt, appartenant à ce projet. Un aperçu ne peut pas être publié ici.");
  const meta = deployment.meta;
  demand(meta?.githubDeployment === "1" && sha.test(meta.githubCommitSha || "") && meta.githubCommitOrg === owner && meta.githubCommitRepo === expected.repository, "La provenance GitHub de ce déploiement n’est pas vérifiable. Les envois depuis un dossier local sont refusés.");
  demand(typeof deployment.url === "string" && /^[a-z0-9.-]+\.vercel\.app$/.test(deployment.url), "L’adresse du build Vercel n’est pas vérifiable.");
  return meta.githubCommitSha;
}
export function validateHistory(comparison: { status?: string; behind_by?: number; base_commit?: { sha: string }; merge_base_commit?: { sha: string } }, previous: string) {
  demand(["ahead", "identical"].includes(comparison.status || "") && comparison.behind_by === 0 && comparison.base_commit?.sha === previous && comparison.merge_base_commit?.sha === previous, "Le code à publier ne contient pas l’historique de la version en service. Publication bloquée.");
}
export function validateQuality(runs: { id: number; head_sha: string; event: string; status: string; conclusion: string; html_url: string }[], jobs: { name: string; conclusion: string; status: string; steps?: { name: string; conclusion: string; status: string }[] }[], head: string) {
  const run = runs.find(run => run.head_sha === head && run.event === "push");
  demand(run?.status === "completed" && run.conclusion === "success", "Les contrôles GitHub de la révision finale doivent avoir réussi. Un contrôle absent, en attente ou bloqué par le budget empêche la publication.");
  const quality = jobs.filter(job => job.name === "Webbing / Quality");
  demand(quality.length === 1 && quality[0].status === "completed" && quality[0].conclusion === "success" && quality[0].steps?.some(step => step.name === "Locked dependencies, tests, build and startup" && step.status === "completed" && step.conclusion === "success"), "Les tests et le build n’ont pas réellement été exécutés avec succès pour cette révision.");
  return run;
}
