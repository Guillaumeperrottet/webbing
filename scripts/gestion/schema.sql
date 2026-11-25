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
