-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS bookmarks (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  place_id TEXT NOT NULL,
  user_id TEXT NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT
    fk_bookmarks_place FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_bookmarks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT
    idx_bookmarks_unique UNIQUE (place_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks ON bookmarks(user_id, place_id);

CREATE TABLE IF NOT EXISTS favorites (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  place_id TEXT NOT NULL,
  user_id TEXT NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT
    fk_favorites_place FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT
    idx_favorites_unique UNIQUE (place_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites ON favorites(user_id, place_id);

CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS collection_items (
  collection_id TEXT NOT NULL,
  place_id TEXT NOT NULL,
  index INT NOT NULL CHECK(index >= 0),

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  PRIMARY KEY (collection_id, place_id),
  CONSTRAINT 
    fk_collection_items_collection FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_collection_items_place FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
  CONSTRAINT 
    idx_collection_items_unique_index UNIQUE (collection_id, index)
);

CREATE TABLE IF NOT EXISTS collections_places (
  collection_id TEXT NOT NULL,
  place_id TEXT NOT NULL,
  index INT NOT NULL CHECK(index >= 0),

  PRIMARY KEY (collection_id, place_id),
  CONSTRAINT
    fk_collections_places_collection FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_collections_places_place FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
  CONSTRAINT
    idx_collections_places_unique UNIQUE (collection_id, place_id, index)
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
    idx_collections_cities_unique UNIQUE (collection_id, city_id, index)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS collections_cities;

DROP TABLE IF EXISTS collections_places;

DROP TABLE IF EXISTS collection_items;

DROP TABLE IF EXISTS collections;

DROP TABLE IF EXISTS favorites;

DROP TABLE IF EXISTS bookmarks;
-- +goose StatementEnd
