DROP INDEX IF EXISTS idx_trip_participants_unique;

DROP INDEX IF EXISTS idx_trip_participants_user;

DROP INDEX IF EXISTS idx_trip_participants_trip;

DROP TABLE IF EXISTS trip_participants;

DROP INDEX IF EXISTS idx_trip_amenities_trip;

DROP TABLE IF EXISTS trip_amenities;

DROP INDEX IF EXISTS idx_trip_locations_poi;

DROP TABLE IF EXISTS trip_locations;

DROP INDEX IF EXISTS idx_trip_comments_from;

DROP INDEX IF EXISTS idx_trip_comments_trip;

DROP TABLE IF EXISTS trip_comments;

DROP INDEX IF EXISTS idx_trip_invites_unique;

DROP INDEX IF EXISTS idx_trip_invites_to;

DROP INDEX IF EXISTS idx_trip_invites_from;

DROP INDEX IF EXISTS idx_trip_invites_trip;

DROP TABLE IF EXISTS trip_invites;

DROP INDEX IF EXISTS idx_trip_owner;

DROP TABLE IF EXISTS trips;
