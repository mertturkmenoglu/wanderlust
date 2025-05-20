-- name: CreateTrip :one
INSERT INTO trips (
  id,
  owner_id,
  title,
  description,
  status,
  visibility_level,
  start_at,
  end_at
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8
) RETURNING *;

-- name: BatchCreateTrips :copyfrom
INSERT INTO trips (
  id,
  owner_id,
  status,
  description,
  title,
  visibility_level,
  start_at,
  end_at
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8
);

-- name: GetTripById :one
SELECT * FROM trips WHERE id = $1;

-- name: GetTripsByIdsPopulated :many
SELECT
  sqlc.embed(trips),
  jsonb_build_object(
    'id', u.id,
    'fullName', u.full_name,
    'username', u.username,
    'profileImage', u.profile_image
  ) AS owner,
  (SELECT json_agg(DISTINCT jsonb_build_object(
    'id', par.id,
    'fullName', par.full_name,
    'username', par.username,
    'profileImage', par.profile_image,
    'role', tp.role
  ))
  FROM trip_participants tp
  JOIN profile par ON par.id = tp.user_id
  WHERE tp.trip_id = trips.id
  ) AS participants,
  (SELECT json_agg(to_jsonb(am.*))
  FROM trip_amenities ta
  JOIN amenities am ON am.id = ta.amenity_id
  WHERE ta.trip_id = trips.id
  ) AS amenities,
  (SELECT json_agg(jsonb_build_object(
    'tripId', tlocations.trip_id,
    'scheduledTime', tlocations.scheduled_time,
    'poiId', tlocations.poi_id,
    'description', tlocations.description
  ))
  FROM trip_locations tlocations
  WHERE tlocations.trip_id = trips.id
  ) AS locations,
  COALESCE(json_agg(DISTINCT jsonb_build_object(
    'poi', to_jsonb(poi.*),
    'poiCategory', to_jsonb(cat.*),
    'poiAddress', to_jsonb(addr.*),
    'poiCity', to_jsonb(cities.*),
    'poiAmenities', COALESCE(poi_amenities.amenities, '[]'),
    'poiMedia', COALESCE(poi_media.media, '[]')
  )) FILTER (WHERE trip_locations.poi_id IS NOT NULL), '[]') AS ps
FROM trips
LEFT JOIN users u ON u.id = trips.owner_id
LEFT JOIN trip_locations ON trip_locations.trip_id = trips.id
LEFT JOIN pois poi ON poi.id = trip_locations.poi_id
LEFT JOIN categories cat ON cat.id = poi.category_id
LEFT JOIN addresses addr ON addr.id = poi.address_id
LEFT JOIN cities ON cities.id = addr.city_id
LEFT JOIN LATERAL (
  SELECT json_agg(to_jsonb(a.*)) AS amenities
  FROM amenities_pois pa
  JOIN amenities a ON a.id = pa.amenity_id
  WHERE pa.poi_id = poi.id
) AS poi_amenities ON TRUE
LEFT JOIN LATERAL (
  SELECT json_agg(to_jsonb(pm.*)) AS media
  FROM media pm
  WHERE pm.poi_id = poi.id
) AS poi_media ON TRUE
WHERE trips.id = ANY($1::TEXT[])
GROUP BY trips.id, u.id
ORDER BY trips.created_at DESC;

-- name: GetAllTripsIds :many
SELECT DISTINCT trips.id, trips.created_at
FROM trips
LEFT JOIN trip_participants tp ON tp.trip_id = trips.id
WHERE trips.owner_id = $1 OR tp.user_id = $1
ORDER BY trips.created_at DESC;

-- name: GetInvitesByToUserId :many
SELECT
  sqlc.embed(invites),
  jsonb_build_object(
    'id', p.id,
    'fullName', p.full_name,
    'username', p.username,
    'profileImage', p.profile_image
  ) AS fromUser
FROM trip_invites invites
JOIN profile p ON p.id = invites.from_id
WHERE invites.to_id = $1
ORDER BY invites.sent_at DESC;

-- name: GetInvitesByTripId :many
SELECT
  sqlc.embed(invites),
  jsonb_build_object(
    'id', pfrom.id,
    'fullName', pfrom.full_name,
    'username', pfrom.username,
    'profileImage', pfrom.profile_image
  ) AS fromUser,
  jsonb_build_object(
    'id', pto.id,
    'fullName', pto.full_name,
    'username', pto.username,
    'profileImage', pto.profile_image
  ) AS toUser
FROM trip_invites invites
JOIN profile pfrom ON pfrom.id = invites.from_id
JOIN profile pto ON pto.id = invites.to_id
WHERE invites.trip_id = $1
ORDER BY invites.sent_at DESC;

-- name: CreateTripInvite :one
INSERT INTO trip_invites (
  id,
  trip_id,
  from_id,
  to_id,
  sent_at,
  expires_at,
  trip_title,
  trip_description,
  role
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8,
  $9
) RETURNING *;

-- name: DeleteInvite :exec
DELETE FROM trip_invites WHERE id = $1;

-- name: AddParticipantToTrip :one
INSERT INTO trip_participants (
  id,
  user_id,
  trip_id,
  role
) VALUES (
  $1,
  $2,
  $3,
  $4
) RETURNING *;

-- name: DeleteParticipant :exec
DELETE FROM trip_participants WHERE trip_id = $1 AND user_id = $2;

-- name: DeleteTrip :exec
DELETE FROM trips WHERE id = $1;

-- name: CreateTripComment :one
INSERT INTO trip_comments (
  id,
  trip_id,
  from_id,
  content,
  created_at
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5
) RETURNING *;

-- name: GetTripComments :many
SELECT
  sqlc.embed(tc),
  (SELECT jsonb_build_object(
    'id', u.id,
    'fullName', u.full_name,
    'username', u.username,
    'profileImage', u.profile_image
  )) AS user
FROM
  trip_comments tc
LEFT JOIN users u ON u.id = tc.from_id
WHERE
  tc.trip_id = $1
ORDER BY tc.created_at DESC
OFFSET $2
LIMIT $3;

-- name: GetTripCommentsCount :one
SELECT COUNT(*) FROM trip_comments WHERE trip_id = $1;

-- name: UpdateTripComment :one
UPDATE trip_comments 
SET content = $2 
WHERE id = $1 AND trip_id = $3
RETURNING *;

-- name: GetTripCommentById :one
SELECT
  sqlc.embed(tc),
  (SELECT jsonb_build_object(
    'id', u.id,
    'fullName', u.full_name,
    'username', u.username,
    'profileImage', u.profile_image
  )) AS user
FROM
  trip_comments tc
LEFT JOIN users u ON u.id = tc.from_id
WHERE tc.id = $1;

-- name: DeleteTripComment :exec
DELETE FROM trip_comments WHERE id = $1;

-- name: DeleteTripAllAmenities :exec
DELETE FROM trip_amenities WHERE trip_id = $1;

-- name: BatchCreateTripAmenities :copyfrom
INSERT INTO trip_amenities (
  trip_id,
  amenity_id
) VALUES (
  $1,
  $2
);

-- name: UpdateTrip :one
UPDATE trips
SET
  title = $2,
  description = $3,
  visibility_level = $4,
  start_at = $5,
  end_at = $6
WHERE id = $1
RETURNING *;

-- name: MoveDanglingLocations :exec
UPDATE trip_locations
SET scheduled_time = $1
WHERE trip_id = $2 AND (scheduled_time < $3 OR scheduled_time > $4);

-- name: DeleteTripAllParticipants :exec
DELETE FROM trip_participants WHERE trip_id = $1;

-- name: DeleteTripAllComments :exec
DELETE FROM trip_comments WHERE trip_id = $1;

-- name: DeleteTripAllInvites :exec
DELETE FROM trip_invites WHERE trip_id = $1;

-- name: CreateTripLocation :one
INSERT INTO trip_locations (
  trip_id,
  poi_id,
  scheduled_time,
  description
) VALUES (
  $1,
  $2,
  $3,
  $4
) RETURNING *;
