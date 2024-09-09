CREATE TABLE IF NOT EXISTS pois (
  id TEXT PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  phone VARCHAR(32),
  description VARCHAR(512) NOT NULL,
  address_id INT NOT NULL,
  website VARCHAR(255),
  price_level SMALLINT NOT NULL,
  accessibility_level SMALLINT NOT NULL,
  total_votes INT NOT NULL,
  total_points INT NOT NULL,
  total_favorites INT NOT NULL,
  category_id SMALLINT NOT NULL,
  open_times JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pois_address ON pois(address_id);

CREATE INDEX IF NOT EXISTS idx_pois_category ON pois(category_id);

-- Create foreign keys
ALTER TABLE
  pois
ADD
  CONSTRAINT fk_pois_address FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE CASCADE;

ALTER TABLE
  pois
ADD
  CONSTRAINT fk_pois_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- Create foreign keys in media table
ALTER TABLE
  media
ADD
  CONSTRAINT fk_media_poi FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE SET DEFAULT;

-- Trigger to update the updated_at field automatically
CREATE OR REPLACE TRIGGER update_pois_timestamp BEFORE
UPDATE
  ON pois FOR EACH ROW EXECUTE FUNCTION update_timestamp();
