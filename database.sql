-- Holotable player-name database
-- Safe to run more than once.

CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(28) NOT NULL,
  name_key VARCHAR(28) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Helpful for the alphabetical list used by the app.
CREATE INDEX IF NOT EXISTS players_name_idx ON players (name);
