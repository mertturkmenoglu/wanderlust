-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS user_top_places (
  user_id TEXT NOT NULL,
  place_id TEXT NOT NULL,
  index INT NOT NULL,

  PRIMARY KEY (user_id, place_id),
  CONSTRAINT 
    fk_user_details_top_places_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT 
    fk_user_details_top_places_place FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
  CONSTRAINT
    idx_user_top_places_unique UNIQUE (user_id, place_id, index)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS user_top_places;
-- +goose StatementEnd
