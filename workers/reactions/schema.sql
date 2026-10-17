-- Reaction totals per drawing and emoji.
CREATE TABLE IF NOT EXISTS counts (
  drawing TEXT NOT NULL,
  emoji   TEXT NOT NULL,
  n       INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (drawing, emoji)
);

-- One row per visitor-drawing-emoji vote. `voter` is a salted SHA-256 hash; no IPs are stored.
CREATE TABLE IF NOT EXISTS votes (
  voter TEXT PRIMARY KEY
);
