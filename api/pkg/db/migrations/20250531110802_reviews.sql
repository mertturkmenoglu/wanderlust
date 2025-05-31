-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  poi_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  content VARCHAR(2048) NOT NULL,
  rating SMALLINT NOT NULL CHECK(rating > 0 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT 
    fk_reviews_poi FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE CASCADE,
  CONSTRAINT 
    fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reviews_poi ON reviews(poi_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

CREATE TABLE IF NOT EXISTS review_images (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  review_id TEXT NOT NULL,
  url VARCHAR(256) NOT NULL,
  index SMALLINT NOT NULL CHECK(index >= 0),
  CONSTRAINT 
    fk_review_images_review FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE SET DEFAULT
);

CREATE INDEX IF NOT EXISTS idx_review_images_review ON review_images(review_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS review_images;

DROP TABLE IF EXISTS reviews;
-- +goose StatementEnd
