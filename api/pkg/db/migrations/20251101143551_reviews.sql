-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,

  place_id TEXT NOT NULL,
  user_id TEXT NOT NULL,

  content VARCHAR(2048) NOT NULL,
  rating SMALLINT NOT NULL CHECK(rating > 0 AND rating <= 5),

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT 
    fk_reviews_place FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
  CONSTRAINT 
    fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reviews_place ON reviews(place_id);

CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS reviews;
-- +goose StatementEnd
