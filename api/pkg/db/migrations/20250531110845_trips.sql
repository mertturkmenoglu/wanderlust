-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS trips (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  title VARCHAR(256) NOT NULL,
  description VARCHAR(4096) NOT NULL DEFAULT '',
  visibility_level VARCHAR(16) NOT NULL,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT
    fk_users_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_trips_owner ON trips(owner_id);

CREATE OR REPLACE TRIGGER update_trips_timestamp BEFORE
UPDATE
  ON trips FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TABLE IF NOT EXISTS trip_invites (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  from_id TEXT NOT NULL,
  to_id TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  trip_title VARCHAR(128) NOT NULL,
  role VARCHAR(16) NOT NULL,
  CONSTRAINT
    fk_trip_invites_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_trip_invites_from FOREIGN KEY (from_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_trip_invites_to FOREIGN KEY (to_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT
    idx_trip_invites_unique UNIQUE (trip_id, to_id)
);

CREATE INDEX IF NOT EXISTS idx_trip_invites_trip ON trip_invites(trip_id);

CREATE INDEX IF NOT EXISTS idx_trip_invites_from ON trip_invites(from_id);

CREATE INDEX IF NOT EXISTS idx_trip_invites_to ON trip_invites(to_id);

CREATE TABLE IF NOT EXISTS trip_comments (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  from_id TEXT NOT NULL,
  content VARCHAR(512) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT
    fk_trip_comments_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_trip_comments_from FOREIGN KEY (from_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_trip_comments_trip ON trip_comments(trip_id);

CREATE INDEX IF NOT EXISTS idx_trip_comments_from ON trip_comments(from_id);

CREATE TABLE IF NOT EXISTS trip_locations (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  scheduled_time TIMESTAMPTZ NOT NULL,
  poi_id TEXT NOT NULL,
  description VARCHAR(1024) NOT NULL,
  CONSTRAINT
    fk_trip_locations_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_trip_locations_poi FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE CASCADE,
  CONSTRAINT
    idx_trip_locations_unique UNIQUE (trip_id, poi_id, scheduled_time)
);

CREATE INDEX IF NOT EXISTS idx_trip_locations_poi ON trip_locations(poi_id);

CREATE INDEX IF NOT EXISTS idx_trip_locations_trip ON trip_locations(trip_id);

CREATE TABLE IF NOT EXISTS trip_amenities (
  trip_id TEXT NOT NULL,
  amenity_id INT NOT NULL,
  PRIMARY KEY (trip_id, amenity_id),
  CONSTRAINT
    fk_trip_amenities_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_trip_amenities_amenity FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_trip_amenities_trip ON trip_amenities(trip_id);

CREATE TABLE IF NOT EXISTS trip_participants (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role VARCHAR(16) NOT NULL,
  CONSTRAINT
    fk_trip_participants_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_trip_participants_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT
    idx_trip_participants_unique UNIQUE (trip_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_trip_participants_trip ON trip_participants(trip_id);

CREATE INDEX IF NOT EXISTS idx_trip_participants_user ON trip_participants(user_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS trip_participants;

DROP TABLE IF EXISTS trip_amenities;

DROP TABLE IF EXISTS trip_locations;

DROP TABLE IF EXISTS trip_comments;

DROP TABLE IF EXISTS trip_invites;

DROP TABLE IF EXISTS trips;
-- +goose StatementEnd
