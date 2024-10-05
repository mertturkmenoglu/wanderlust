CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  description VARCHAR(1024) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS collection_items (
  collection_id TEXT NOT NULL,
  poi_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (collection_id, poi_id),
  CONSTRAINT fk_collection_items_collection FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
  CONSTRAINT fk_collection_items_poi FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE CASCADE
);
