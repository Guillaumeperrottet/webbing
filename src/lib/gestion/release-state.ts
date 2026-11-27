export type ReleaseProof = {
  projectId: string; name: string; repository: string; branch: string;
  deploymentId: string; sha: string; previousId: string; previousSha: string;
  domains: string[]; url: string; runId: number; runUrl: string; pullUrl: string;
  source?: "owner-push"; pushId?: string;
};
export type ReleasePreview = ReleaseProof & { id: string; expiresAt: string };
export type ReleaseHistory = { id: string; status: string; proof: ReleaseProof; error: string | null; requestedAt: string };
export type ReleaseConnection = { project_id: string; name: string; expires_at: string };
export class PublicationError extends Error {}
export function releaseError(error: unknown) {
  return error instanceof PublicationError ? error.message : "La vérification a échoué. Aucune nouvelle demande de publication n’est envoyée. Vérifie les accès Vercel et GitHub.";
}
export const releaseLabels: Record<string, string> = {
  checking: "Vérification finale", publishing: "Publication à confirmer", succeeded: "En ligne · domaines vérifiés",
  failed: "Publication arrêtée", safety_error: "Protection à rétablir dans Vercel",
};
