import { createHmac, timingSafeEqual } from "node:crypto";
import { demand } from "./release-policy";

export type OwnerRule = { repository: string; repository_id: string; owner_id: string; owner_login: string; branch: string; enabled_at: string; enabled: boolean };
export type GitHubIdentity = { id: number; login: string; type: string };
export type OwnerPushEvent = { repository: { id: number; full_name: string }; sender: GitHubIdentity; ref: string; before: string; after: string; forced: boolean; deleted: boolean; created: boolean };
const sha = /^[a-f0-9]{40}$/;

export function validGitHubSignature(body: Buffer, signature: string | null, secret: string) {
  if (!signature || !/^sha256=[a-f0-9]{64}$/.test(signature)) return false;
  return timingSafeEqual(createHmac("sha256", secret).update(body).digest(), Buffer.from(signature.slice(7), "hex"));
}
export function isOwner(identity: GitHubIdentity | undefined, rule: OwnerRule) {
  return !!identity && identity.type === "User" && String(identity.id) === rule.owner_id && identity.login === rule.owner_login;
}
export function validateOwnerPush(event: OwnerPushEvent, rule: OwnerRule) {
  demand(rule.enabled && event.repository.full_name === rule.repository && String(event.repository.id) === rule.repository_id, "Dépôt ou règle de publication incorrects.");
  demand(isOwner(event.sender, rule), "Ce push ne provient pas du compte personnel autorisé.");
  demand(event.ref === `refs/heads/${rule.branch}` && event.forced === false && event.deleted === false && event.created === false, "Seuls les pushes ordinaires sur la branche de production sont publiés automatiquement.");
  demand(sha.test(event.before) && sha.test(event.after) && !/^0+$/.test(event.before) && !/^0+$/.test(event.after) && event.before !== event.after, "Révisions du push incorrectes.");
}
export function validateOwnerRun(run: { event: string; head_sha: string; head_branch: string; actor?: GitHubIdentity; triggering_actor?: GitHubIdentity; created_at: string }, rule: OwnerRule, head: string) {
  demand(run.event === "push" && run.head_sha === head && run.head_branch === rule.branch && isOwner(run.actor, rule) && isOwner(run.triggering_actor, rule), "Le contrôle ne correspond pas à un push du compte personnel autorisé.");
  const created = new Date(run.created_at).getTime(), enabled = new Date(rule.enabled_at).getTime();
  demand(Number.isFinite(created) && Number.isFinite(enabled) && created >= enabled, "Cette version précède l’activation des publications personnelles. Validation manuelle requise.");
}
export function validateOwnerChanges(commits: { sha: string; author: GitHubIdentity | null }[], total: number, pulls: { user: GitHubIdentity | null; head: { ref: string }; labels: { name: string }[] }[][], trackedDependency: boolean, owner: string) {
  demand(total > 0 && total <= 50 && commits.length === total && pulls.length === total, "L’historique à publier est incomplet ou trop étendu. Validation manuelle requise.");
  demand(!trackedDependency, "Une proposition de dépendances est incluse dans cette version. Valide sa publication dans Webbing.");
  for (let i = 0; i < commits.length; i++) {
    demand(sha.test(commits[i].sha) && commits[i].author?.type === "User" && commits[i].author?.login === owner, "Une révision provient d’un autre auteur ou d’un automatisme. Validation manuelle requise.");
    demand(pulls[i].length < 100 && pulls[i].every(pr => pr.user?.type === "User" && pr.user.login === owner && !/^dependabot\//i.test(pr.head.ref) && !pr.labels.some(label => /^(dependencies|dependency|dependabot)$/i.test(label.name))), "Cette version inclut une proposition de dépendances ou un autre contributeur. Validation manuelle requise.");
  }
}
