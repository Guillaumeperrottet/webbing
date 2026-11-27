CREATE TABLE IF NOT EXISTS ops_owner_release_rules (
 repository text PRIMARY KEY, repository_id bigint NOT NULL UNIQUE,
 owner_id bigint NOT NULL, owner_login text NOT NULL, branch text NOT NULL,
 secret_cipher text NOT NULL, webhook_id bigint, enabled boolean NOT NULL DEFAULT false,
 enabled_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE ops_owner_release_rules ADD COLUMN IF NOT EXISTS blocked_reason text;
CREATE TABLE IF NOT EXISTS ops_owner_pushes (
 id uuid PRIMARY KEY, delivery_id text NOT NULL UNIQUE,
 repository text NOT NULL REFERENCES ops_owner_release_rules(repository),
 before_sha text NOT NULL, head_sha text NOT NULL, received_at timestamptz NOT NULL DEFAULT now(),
 state text NOT NULL DEFAULT 'waiting' CHECK(state IN ('waiting','handled','superseded')),
 last_error text, checked_at timestamptz,
 UNIQUE(repository,head_sha)
);
CREATE TABLE IF NOT EXISTS ops_owner_release_attempts (
 push_id uuid NOT NULL REFERENCES ops_owner_pushes(id), project_id text NOT NULL,
 release_id uuid NOT NULL UNIQUE REFERENCES ops_releases(id), PRIMARY KEY(push_id,project_id)
);
CREATE INDEX IF NOT EXISTS ops_owner_pushes_waiting ON ops_owner_pushes(received_at) WHERE state='waiting';
