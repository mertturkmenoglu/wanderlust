-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS places (
  id TEXT PRIMARY KEY,

  name VARCHAR(128) NOT NULL,
  phone VARCHAR(32),
  description TEXT NOT NULL,
  website VARCHAR(256),

  address_id INT NOT NULL,
  category_id SMALLINT NOT NULL,

  price_level SMALLINT NOT NULL CHECK(price_level >= 0),
  accessibility_level SMALLINT NOT NULL CHECK(accessibility_level >= 0),

  total_votes INT NOT NULL CHECK(total_votes >= 0),
  total_points INT NOT NULL CHECK(total_points >= 0),
  total_favorites INT NOT NULL CHECK(total_favorites >= 0),

  hours hstore NOT NULL,
  amenities hstore NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT
    fk_places_address FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_places_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_places_address ON places(address_id);

CREATE INDEX IF NOT EXISTS idx_places_category ON places(category_id);

CREATE OR REPLACE TRIGGER update_places_timestamp BEFORE
UPDATE
  ON places FOR EACH ROW EXECUTE FUNCTION update_timestamp();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

DROP TABLE IF EXISTS places;
-- +goose StatementEnd
