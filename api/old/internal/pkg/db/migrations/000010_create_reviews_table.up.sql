CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  poi_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  content VARCHAR(2048) NOT NULL,
  rating SMALLINT NOT NULL CHECK(rating > 0 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT fk_review_poi FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE CASCADE,
  CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reviews_poi ON reviews(poi_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

CREATE TABLE IF NOT EXISTS review_media (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  review_id TEXT NOT NULL,
  url VARCHAR(255) NOT NULL,
  media_order SMALLINT NOT NULL CHECK(media_order >= 1 AND media_order <= 4),
  CONSTRAINT fk_review_media_review FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_review_media_review ON review_media(review_id);
