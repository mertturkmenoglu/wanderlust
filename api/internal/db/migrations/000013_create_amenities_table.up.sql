CREATE TABLE IF NOT EXISTS amenities (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(64) NOT NULL
);

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_amenities_name ON amenities(name);

CREATE TABLE IF NOT EXISTS amenities_pois (
  amenity_id INT NOT NULL,
  poi_id TEXT NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_amenities_pois_unique ON amenities_pois(amenity_id, poi_id);

-- Create foreign keys
ALTER TABLE
  amenities_pois
ADD
  CONSTRAINT fk_amenities_pois_amenity FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE;

ALTER TABLE
  amenities_pois
ADD
  CONSTRAINT fk_amenities_pois_poi FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE CASCADE;
