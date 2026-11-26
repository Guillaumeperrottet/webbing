CREATE TABLE IF NOT EXISTS ops_release_connections (
 project_id text PRIMARY KEY, id uuid NOT NULL UNIQUE, name text NOT NULL,
 secret_cipher text NOT NULL, token_id text NOT NULL, expires_at timestamptz NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ops_releases (
 id uuid PRIMARY KEY, project_id text NOT NULL, requested_by text NOT NULL, session_id text NOT NULL,
 proof jsonb NOT NULL, status text NOT NULL DEFAULT 'prepared'
 CHECK(status IN ('prepared','checking','publishing','succeeded','failed','safety_error')),
 requested_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz NOT NULL DEFAULT now()+interval '10 minutes',
 confirmed_at timestamptz, finished_at timestamptz, error text
);
CREATE UNIQUE INDEX IF NOT EXISTS ops_releases_active ON ops_releases(project_id) WHERE status IN ('checking','publishing','safety_error');
CREATE TABLE IF NOT EXISTS ops_release_mfa_attempts (
 id bigserial PRIMARY KEY, actor text NOT NULL, attempted_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ops_release_mfa_attempts_actor ON ops_release_mfa_attempts(actor,attempted_at);
CREATE TABLE IF NOT EXISTS ops_release_mfa_codes (
 digest text PRIMARY KEY, used_at timestamptz NOT NULL DEFAULT now()
);
