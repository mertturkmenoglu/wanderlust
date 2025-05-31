-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS collection_items (
  collection_id TEXT NOT NULL,
  poi_id TEXT NOT NULL,
  index INT NOT NULL CHECK(index >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (collection_id, poi_id),
  CONSTRAINT 
    fk_collection_items_collection FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
  CONSTRAINT 
    fk_collection_items_poi FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE CASCADE,
  CONSTRAINT 
    idx_collection_items_unique_index UNIQUE (collection_id, index)
);

CREATE TABLE IF NOT EXISTS collections_cities (
  collection_id TEXT NOT NULL,
  city_id INT NOT NULL,
  index INT NOT NULL CHECK(index >= 0),
  PRIMARY KEY (collection_id, city_id),
  CONSTRAINT
    fk_collections_cities_collection FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_collections_cities_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
  CONSTRAINT
    idx_collections_cities_unique UNIQUE (collection_id, index)
);

CREATE TABLE IF NOT EXISTS collections_pois (
  collection_id TEXT NOT NULL,
  poi_id TEXT NOT NULL,
  index INT NOT NULL CHECK(index >= 0),
  PRIMARY KEY (collection_id, poi_id),
  CONSTRAINT
    fk_collections_pois_collection FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_collections_pois_poi FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE CASCADE,
  CONSTRAINT
    idx_collections_pois_unique UNIQUE (collection_id, index)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS collections_pois;

DROP TABLE IF EXISTS collections_cities;

DROP TABLE IF EXISTS collection_items;

DROP TABLE IF EXISTS collections;
-- +goose StatementEnd
