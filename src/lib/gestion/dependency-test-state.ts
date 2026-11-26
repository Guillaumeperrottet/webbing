export const MAX_MANUAL_TESTS = 3;

export type TestState = "untested" | "pending" | "passed" | "failed" | "not_started" | "stale";
type TestSnapshot = {
  ready: boolean;
  head_sha: string;
  base_sha: string;
  test_status: string | null;
  test_head_sha?: string | null;
  test_base_sha?: string | null;
  test_failure_kind?: string | null;
};

export function dependencyTestState(update: TestSnapshot): TestState {
  if (update.test_status === "requested" || update.test_status === "running") return "pending";
  if (update.test_status && (update.test_head_sha !== update.head_sha || update.test_base_sha !== update.base_sha)) return "stale";
  if (update.test_status === "success") return "passed";
  if (update.test_status === "failed") return ["not_started", "dispatch_refused", "missing_run", "preflight"].includes(update.test_failure_kind || "") ? "not_started" : "failed";
  return update.ready ? "passed" : "untested";
}

export const testStateLabels: Record<TestState, string> = {
  untested: "À tester", pending: "Tests en cours", passed: "Tests réussis",
  failed: "Tests échoués", not_started: "Tests non démarrés", stale: "À retester",
};

type Job = { name: string; conclusion: string | null; steps?: { name: string; conclusion?: string | null }[] };
export function dependencyRunFailure(conclusion: string | null, jobs?: Job[]) {
  if (conclusion === "cancelled") return { kind: "canceled", message: "Exécution annulée dans GitHub. Aucune relance automatique." };
  if (conclusion === "timed_out") return { kind: "checks_failed", message: "Le temps maximal des contrôles a été dépassé. Consulter le journal avant de relancer." };
  if (jobs?.length && jobs.every(job => Array.isArray(job.steps) && job.steps.length === 0)) return { kind: "not_started", message: "GitHub n’a exécuté aucune étape. Vérifier le quota, la facturation ou l’accès aux runners ; ce résultat ne signale pas une erreur du code." };
  if (jobs?.some(job => job.name === "Webbing / Resolve manual request" && job.conclusion === "failure")) return { kind: "preflight", message: "GitHub n’a pas pu préparer cette version pour les tests. La proposition a peut-être changé ; consulter le journal et actualiser." };
  return { kind: "checks_failed", message: "Les contrôles ont échoué. Consulter le journal GitHub avant de demander une nouvelle exécution." };
}

export type BatchSelection = { repository: string; number: number; head: string; base: string };
export type BatchItem = BatchSelection & { requestId: string; title: string; updateType: string; private: boolean };
export type BatchPreview = { id: string; items: BatchItem[]; expiresAt: string };
export type BatchResultItem = BatchItem & { status: string | null; runUrl: string | null; error: string | null; failureKind: string | null };
export type BatchResult = { id: string; status: string; requestedAt: string; finishedAt: string | null; error: string | null; items: BatchResultItem[] };
