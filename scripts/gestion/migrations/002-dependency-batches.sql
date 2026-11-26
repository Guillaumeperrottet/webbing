CREATE TABLE IF NOT EXISTS ops_dependency_batches (
 id uuid PRIMARY KEY, requested_by text NOT NULL, session_id text NOT NULL,
 status text NOT NULL DEFAULT 'prepared' CHECK(status IN ('prepared','checking','running','completed','failed','expired')),
 items jsonb NOT NULL CHECK(jsonb_typeof(items)='array' AND jsonb_array_length(items) BETWEEN 1 AND 3),
 requested_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz NOT NULL DEFAULT now()+interval '15 minutes',
 confirmed_at timestamptz, finished_at timestamptz, error text
);
CREATE UNIQUE INDEX IF NOT EXISTS ops_dependency_batches_active ON ops_dependency_batches((true)) WHERE status IN ('checking','running');
ALTER TABLE ops_dependency_tests ADD COLUMN IF NOT EXISTS batch_id uuid REFERENCES ops_dependency_batches(id);
ALTER TABLE ops_dependency_tests ADD COLUMN IF NOT EXISTS failure_kind text;
CREATE INDEX IF NOT EXISTS ops_dependency_tests_batch ON ops_dependency_tests(batch_id);
