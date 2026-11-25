CREATE TABLE IF NOT EXISTS ops_applications (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug text UNIQUE NOT NULL, name text NOT NULL,
 environment text NOT NULL DEFAULT 'production', url text, admin_url text, vercel_id text UNIQUE,
 supabase_ref text, repository text, framework text, react_version text, node_version text,
 dependency_bot boolean NOT NULL DEFAULT false, cron_count integer NOT NULL DEFAULT 0,
 test_count integer NOT NULL DEFAULT 0, inventory_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ops_verified_sessions (
 session_id uuid PRIMARY KEY REFERENCES "session"(id) ON DELETE CASCADE,
 verified_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ops_invitations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), token_hash text UNIQUE NOT NULL,
 email text NOT NULL, expires_at timestamptz NOT NULL, consumed_at timestamptz
);
CREATE TABLE IF NOT EXISTS ops_health (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 application_id uuid NOT NULL REFERENCES ops_applications(id) ON DELETE CASCADE,
 state text NOT NULL, http_code integer, duration_ms integer, checked_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ops_health_latest ON ops_health(application_id,checked_at DESC);
CREATE TABLE IF NOT EXISTS ops_collectors (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, token_hash text UNIQUE NOT NULL,
 last_seen timestamptz, revoked_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ops_backups (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 application_id uuid NOT NULL REFERENCES ops_applications(id) ON DELETE CASCADE,
 collector_id uuid NOT NULL REFERENCES ops_collectors(id), state text NOT NULL,
 backup_at timestamptz, bytes bigint, max_age_hours integer NOT NULL DEFAULT 24,
 restore_tested_at timestamptz, reported_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ops_backups_latest ON ops_backups(application_id,reported_at DESC);
CREATE TABLE IF NOT EXISTS ops_audit (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, kind text NOT NULL,
 detail text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ops_jobs (name text PRIMARY KEY, last_run timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS ops_nas_sources (
 application text PRIMARY KEY REFERENCES ops_applications(slug),
 directory text NOT NULL, last_success text NOT NULL, expected_project text NOT NULL,
 max_age_hours integer NOT NULL DEFAULT 36
);
ALTER TABLE ops_applications ADD COLUMN IF NOT EXISTS current_deployment_id text;
ALTER TABLE ops_applications ADD COLUMN IF NOT EXISTS current_deployment_at timestamptz;
ALTER TABLE ops_applications ADD COLUMN IF NOT EXISTS rollback_pending boolean NOT NULL DEFAULT false;
ALTER TABLE ops_applications ADD COLUMN IF NOT EXISTS provider_synced_at timestamptz;
ALTER TABLE ops_applications ADD COLUMN IF NOT EXISTS archived_at timestamptz;
ALTER TABLE ops_applications ADD COLUMN IF NOT EXISTS database_provider text;
ALTER TABLE ops_applications ADD COLUMN IF NOT EXISTS backup_required boolean NOT NULL DEFAULT false;
CREATE TABLE IF NOT EXISTS ops_integrations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), provider text NOT NULL CHECK(provider IN ('vercel','supabase')),
 name text NOT NULL, secret_cipher text NOT NULL, config jsonb NOT NULL DEFAULT '{}',
 created_at timestamptz NOT NULL DEFAULT now(), last_sync_at timestamptz,
 last_attempt_at timestamptz, last_error text, revoked_at timestamptz
);
CREATE TABLE IF NOT EXISTS ops_provider_events (
 event_id text PRIMARY KEY, integration_id uuid NOT NULL REFERENCES ops_integrations(id),
 event_type text NOT NULL, event_at timestamptz NOT NULL, received_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ops_deployments (
 deployment_id text PRIMARY KEY, application_id uuid NOT NULL REFERENCES ops_applications(id),
 target text NOT NULL, state text NOT NULL, url text, branch text, commit_sha text,
 created_at timestamptz NOT NULL, event_at timestamptz NOT NULL,
 observed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ops_deployments_latest ON ops_deployments(application_id,created_at DESC);
CREATE TABLE IF NOT EXISTS ops_supabase_projects (
 ref text PRIMARY KEY, name text NOT NULL, region text, status text,
 services jsonb NOT NULL DEFAULT '[]', services_error text,
 integration_id uuid REFERENCES ops_integrations(id), checked_at timestamptz,
 attempted_at timestamptz NOT NULL DEFAULT now(), last_error text
);
ALTER TABLE ops_integrations DROP CONSTRAINT IF EXISTS ops_integrations_provider_check;
ALTER TABLE ops_integrations ADD CONSTRAINT ops_integrations_provider_check CHECK(provider IN ('vercel','supabase','github'));
CREATE TABLE IF NOT EXISTS ops_repositories (
 full_name text PRIMARY KEY, default_branch text NOT NULL,
 ci_configured boolean NOT NULL DEFAULT false, auto_merge_enabled boolean NOT NULL DEFAULT false,
 integration_id uuid REFERENCES ops_integrations(id), last_sync_at timestamptz, last_error text
);
CREATE TABLE IF NOT EXISTS ops_dependency_updates (
 repository text NOT NULL REFERENCES ops_repositories(full_name), number integer NOT NULL,
 title text NOT NULL, url text NOT NULL, state text NOT NULL DEFAULT 'open',
 head_sha text NOT NULL, base_sha text NOT NULL, update_type text NOT NULL DEFAULT 'unknown',
 dependencies jsonb NOT NULL DEFAULT '[]', checks jsonb NOT NULL DEFAULT '[]',
 ready boolean NOT NULL DEFAULT false, auto_eligible boolean NOT NULL DEFAULT false, reason text NOT NULL,
 checked_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL,
 merged_sha text, PRIMARY KEY(repository,number)
);
ALTER TABLE ops_repositories ADD COLUMN IF NOT EXISTS setup_pr_url text;
ALTER TABLE ops_repositories ADD COLUMN IF NOT EXISTS setup_state text NOT NULL DEFAULT 'prepared';

CREATE TABLE IF NOT EXISTS ops_dependency_approvals (
 id uuid PRIMARY KEY, repository text NOT NULL REFERENCES ops_repositories(full_name), number integer NOT NULL,
 head_sha text NOT NULL, base_sha text NOT NULL, requested_by text NOT NULL,
 status text NOT NULL DEFAULT 'requested', requested_at timestamptz NOT NULL DEFAULT now(),
 finished_at timestamptz, run_url text, merged_sha text, error text
);
CREATE UNIQUE INDEX IF NOT EXISTS ops_dependency_approvals_pending ON ops_dependency_approvals(repository,number,head_sha,base_sha) WHERE status='requested';
