-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS favorites (
  poi_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (poi_id, user_id),
  CONSTRAINT
    fk_favorites_poi FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_favorites_poi ON favorites(poi_id);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS favorites;
-- +goose StatementEnd
