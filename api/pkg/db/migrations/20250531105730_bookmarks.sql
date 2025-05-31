-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS bookmarks (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  poi_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT
    fk_bookmarks_poi FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_bookmarks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT
    idx_bookmarks_unique UNIQUE (poi_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_poi ON bookmarks(poi_id);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS bookmarks;
-- +goose StatementEnd
