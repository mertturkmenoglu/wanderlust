CREATE TABLE IF NOT EXISTS collections_cities (
  collection_id TEXT NOT NULL,
  city_id INT NOT NULL,
  index INT NOT NULL,
  PRIMARY KEY (collection_id, city_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_collections_cities_unique_index ON collections_cities(index);

CREATE INDEX IF NOT EXISTS idx_collections_cities_city ON collections_cities(city_id);

CREATE TABLE IF NOT EXISTS collections_pois (
  collection_id TEXT NOT NULL,
  poi_id TEXT NOT NULL,
  index INT NOT NULL,
  PRIMARY KEY (collection_id, poi_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_collections_pois_unique_index ON collections_pois(index);

CREATE INDEX IF NOT EXISTS idx_collections_pois_poi ON collections_pois(poi_id);
