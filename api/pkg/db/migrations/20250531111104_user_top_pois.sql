-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS user_top_pois (
  user_id TEXT NOT NULL,
  poi_id TEXT NOT NULL,
  index INT NOT NULL,
  PRIMARY KEY (user_id, poi_id),
  CONSTRAINT 
    fk_user_details_top_pois_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT 
    fk_user_details_top_pois_poi FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE CASCADE,
  CONSTRAINT
    idx_user_top_pois_unique UNIQUE (user_id, poi_id, index)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS user_top_pois;
-- +goose StatementEnd
