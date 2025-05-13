-- Active: 1747132253857@@127.0.0.1@5432@wanderlust@public
CREATE TABLE IF NOT EXISTS trips (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  status VARCHAR(16) NOT NULL,
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

CREATE TABLE IF NOT EXISTS trips_invites (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  from_id TEXT NOT NULL,
  to_id TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  role VARCHAR(16) NOT NULL,
  CONSTRAINT
    fk_trips_invites_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_trips_invites_from FOREIGN KEY (from_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_trips_invites_to FOREIGN KEY (to_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_trips_invites_trip ON trips_invites(trip_id);

CREATE INDEX IF NOT EXISTS idx_trips_invites_from ON trips_invites(from_id);

CREATE INDEX IF NOT EXISTS idx_trips_invites_to ON trips_invites(to_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_trips_invites_unique ON trips_invites(trip_id, from_id, to_id);

CREATE TABLE IF NOT EXISTS trips_comments (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  from_id TEXT NOT NULL,
  content VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT
    fk_trips_comments_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_trips_comments_from FOREIGN KEY (from_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_trips_comments_trip ON trips_comments(trip_id);

CREATE INDEX IF NOT EXISTS idx_trips_comments_from ON trips_comments(from_id);

CREATE TABLE IF NOT EXISTS trips_days (
  trip_id TEXT NOT NULL,
  day_no INT NOT NULL,
  description VARCHAR(255) NOT NULL,
  PRIMARY KEY (trip_id, day_no),
  CONSTRAINT
    fk_trips_days_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS trips_days_locations (
  trip_id TEXT NOT NULL,
  day_no INT NOT NULL,
  poi_id TEXT NOT NULL,
  PRIMARY KEY (trip_id, day_no, poi_id),
  CONSTRAINT
    fk_trips_days_locations_days FOREIGN KEY (trip_id, day_no) REFERENCES trips_days(trip_id, day_no) ON DELETE CASCADE,
  CONSTRAINT
    fk_trips_days_locations_poi FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_trips_days_locations_poi ON trips_days_locations(poi_id);

CREATE TABLE IF NOT EXISTS trips_amenities (
  trip_id TEXT NOT NULL,
  amenity_id INT NOT NULL,
  CONSTRAINT
    fk_trips_amenities_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_trips_amenities_amenity FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_trips_amenities_trip ON trips_amenities(trip_id);

CREATE INDEX IF NOT EXISTS idx_trips_amenities_amenity ON trips_amenities(amenity_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_trips_amenities_unique ON trips_amenities(trip_id, amenity_id);

CREATE TABLE IF NOT EXISTS trips_participants (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role VARCHAR(16) NOT NULL,
  CONSTRAINT
    fk_trips_participants_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  CONSTRAINT
    fk_trips_participants_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_trips_participants_trip ON trips_participants(trip_id);

CREATE INDEX IF NOT EXISTS idx_trips_participants_user ON trips_participants(user_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_trips_participants_unique ON trips_participants(trip_id, user_id);
