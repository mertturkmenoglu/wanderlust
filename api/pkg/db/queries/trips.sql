-- name: CreateTrip :one
INSERT INTO trips (
  id,
  owner_id,
  title,
  description,
  visibility_level,
  requested_amenities,
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
  title,
  description,
  visibility_level,
  requested_amenities,
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

-- name: FindTripById :one
SELECT *
FROM trips
WHERE id = $1;

-- name: FindManyTripsByIdsPopulated :many
SELECT
  sqlc.embed(trips),
  jsonb_build_object(
    'id', u.id,
    'fullName', u.full_name,
    'username', u.username,
    'profileImage', u.profile_image
  ) as owner,
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
  (SELECT json_agg(jsonb_build_object(
    'id', tplaces.id,
    'tripId', tplaces.trip_id,
    'scheduledTime', tplaces.scheduled_time,
    'placeId', tplaces.place_id,
    'description', tplaces.description
  ))
  FROM trip_places tplaces
  WHERE tplaces.trip_id = trips.id
  ) AS tripPlaces,
  (SELECT get_places(
    ARRAY(
      SELECT 
        DISTINCT place_id 
      FROM trip_places
      WHERE trip_places.trip_id = trips.id
    )
  )) AS places
FROM trips
LEFT JOIN users u ON u.id = trips.owner_id
LEFT JOIN trip_places ON trip_places.trip_id = trips.id
WHERE trips.id = ANY($1::TEXT[])
GROUP BY trips.id, u.id
ORDER BY trips.created_at DESC;

-- name: FindManyTripsByOwnerIdOrParticipantId :many
SELECT
  DISTINCT trips.id, trips.created_at
FROM trips
LEFT JOIN trip_participants ON trip_participants.trip_id = trips.id
WHERE trips.owner_id = $1 OR trip_participants.user_id = $1
ORDER BY trips.created_at DESC
OFFSET $2
LIMIT $3;

-- name: CountTripsByOwnerIdOrParticipantId :one
SELECT COUNT(*)
FROM trips
LEFT JOIN trip_participants ON trip_participants.trip_id = trips.id
WHERE trips.owner_id = $1 OR trip_participants.user_id = $1;

-- name: FindManyTripInvitesByToUserId :many
SELECT
  sqlc.embed(invites),
  jsonb_build_object(
    'id', u.id,
    'fullName', u.full_name,
    'username', u.username,
    'profileImage', u.profile_image
  ) AS fromUser
FROM trip_invites invites
LEFT JOIN users u ON u.id = invites.from_id
WHERE invites.to_id = $1
ORDER BY invites.sent_at DESC;

-- name: FindManyTripInvitesByTripId :many
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
  role,
  sent_at,
  expires_at,
  trip_title
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

-- name: RemoveTripInviteById :execresult
DELETE FROM trip_invites
WHERE id = $1;

-- name: FindManyTripInvitesWhereExpired :many
SELECT id
FROM trip_invites
WHERE expires_at < NOW();

-- name: CreateTripParticipant :one
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

-- name: RemoveTripParticipantByTripIdAndUserId :execresult
DELETE FROM trip_participants
WHERE trip_id = $1 AND user_id = $2;

-- name: RemoveTripById :execresult
DELETE FROM trips
WHERE id = $1;

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

-- name: FindManyTripCommentsByTripId :many
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

-- name: CountTripCommentsByTripId :one
SELECT COUNT(*)
FROM trip_comments
WHERE trip_id = $1;

-- name: UpdateTripComment :execresult
UPDATE trip_comments
SET content = $2
WHERE id = $1 AND trip_id = $3;

-- name: FindTripCommentById :one
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

-- name: RemoveTripCommentById :execresult
DELETE FROM trip_comments
WHERE id = $1;

-- name: UpdateTrip :execresult
UPDATE trips
SET
  title = $2,
  description = $3,
  visibility_level = $4,
  requested_amenities = $5,
  start_at = $6,
  end_at = $7
WHERE id = $1;

-- name: MoveDanglingTripPlaces :execresult
UPDATE trip_places
SET scheduled_time = $1
WHERE trip_id = $2 AND (scheduled_time < $3 OR scheduled_time > $4);

-- name: RemoveTripParticipantsByTripId :execresult
DELETE FROM trip_participants
WHERE trip_id = $1;

-- name: RemoveTripCommentsByTripId :execresult
DELETE FROM trip_comments
WHERE trip_id = $1;

-- name: RemoveTripInvitesByTripId :execresult
DELETE FROM trip_invites
WHERE trip_id = $1;

-- name: CreateTripPlace :one
INSERT INTO trip_places (
  id,
  trip_id,
  place_id,
  scheduled_time,
  description
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5
) RETURNING *;

-- name: UpdateTripPlace :execresult
UPDATE trip_places
SET
  description = $2,
  scheduled_time = $3
WHERE id = $1 AND trip_id = $4;

-- name: FindTripPlaceById :one
SELECT
  sqlc.embed(tp)
FROM trip_places tp
WHERE tp.id = $1
LIMIT 1;

-- name: RemoveTripPlaceById :execresult
DELETE FROM trip_places
WHERE id = $1;
