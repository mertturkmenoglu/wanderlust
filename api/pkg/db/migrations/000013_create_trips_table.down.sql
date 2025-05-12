DROP INDEX IF EXISTS idx_trips_participants_unique;

DROP INDEX IF EXISTS idx_trips_participants_user;

DROP INDEX IF EXISTS idx_trips_participants_trip;

DROP TABLE IF EXISTS trips_participants;

DROP INDEX IF EXISTS idx_trips_amenities_unique;

DROP INDEX IF EXISTS idx_trips_amenities_amenity;

DROP INDEX IF EXISTS idx_trips_amenities_trip;

DROP TABLE IF EXISTS trips_amenities;

DROP INDEX IF EXISTS idx_trips_days_locations_unique;

DROP INDEX IF EXISTS idx_trips_days_locations_poi;

DROP INDEX IF EXISTS idx_trips_days_locations_day;

DROP TABLE IF EXISTS trips_days_locations;

DROP INDEX IF EXISTS idx_trips_days_trip;

DROP TABLE IF EXISTS trips_days;

DROP INDEX IF EXISTS idx_trips_comments_from;

DROP INDEX IF EXISTS idx_trips_comments_trip;

DROP TABLE IF EXISTS trips_comments;

DROP INDEX IF EXISTS idx_trips_invites_unique;

DROP INDEX IF EXISTS idx_trips_invites_to;

DROP INDEX IF EXISTS idx_trips_invites_from;

DROP INDEX IF EXISTS idx_trips_invites_trip;

DROP TABLE IF EXISTS trips_invites;

DROP INDEX IF EXISTS idx_trips_owner;

DROP TABLE IF EXISTS trips;
