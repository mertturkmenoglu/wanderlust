-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS pois (
  id TEXT PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  phone VARCHAR(32),
  description TEXT NOT NULL,
  address_id INT NOT NULL,
  website VARCHAR(256),
  price_level SMALLINT NOT NULL CHECK(price_level >= 0),
  accessibility_level SMALLINT NOT NULL CHECK(accessibility_level >= 0),
  total_votes INT NOT NULL CHECK(total_votes >= 0),
  total_points INT NOT NULL CHECK(total_points >= 0),
  total_favorites INT NOT NULL CHECK(total_favorites >= 0),
  category_id SMALLINT NOT NULL,
  hours JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT
    fk_pois_address FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_pois_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_pois_address ON pois(address_id);

CREATE INDEX IF NOT EXISTS idx_pois_category ON pois(category_id);

CREATE OR REPLACE TRIGGER update_pois_timestamp BEFORE
UPDATE
  ON pois FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TABLE IF NOT EXISTS images (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  poi_id TEXT NOT NULL,
  url VARCHAR(256) NOT NULL,
  alt VARCHAR(256) NOT NULL,
  index SMALLINT NOT NULL CHECK(index >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT 
    fk_images_pois FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE SET DEFAULT
);

CREATE INDEX IF NOT EXISTS idx_images_pois ON images(poi_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS images;

DROP TABLE IF EXISTS pois;
-- +goose StatementEnd
