-- name: CreateTrip :one
INSERT INTO trips (
  id,
  owner_id,
  title,
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
  $7
) RETURNING *;

-- name: BatchCreateTrips :copyfrom
INSERT INTO trips (
  id,
  owner_id,
  status,
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
  $7
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
  FROM trips_participants tp
  JOIN profile par ON par.id = tp.user_id
  WHERE tp.trip_id = trips.id
  ) as participants,
  (SELECT json_agg(to_jsonb(am.*))
  FROM trips_amenities ta
  JOIN amenities am ON am.id = ta.amenity_id
  WHERE ta.trip_id = trips.id
  ) AS amenities,
  (SELECT json_agg(DISTINCT jsonb_build_object(
    'id', tc.id,
    'from', jsonb_build_object(
      'id', profile.id,
      'fullName', profile.full_name,
      'username', profile.username,
      'profileImage', profile.profile_image
    ),
    'content', tc.content,
    'createdAt', tc.created_at
  ))
  FROM trips_comments tc
  JOIN profile ON profile.id = tc.from_id
  WHERE tc.trip_id = trips.id
  ) AS comments,
  (SELECT json_agg(jsonb_build_object(
    'tripId', td.trip_id,
    'dayNo', td.day_no,
    'description', td.description
  ))
  FROM trips_days td
  WHERE td.trip_id = trips.id
  ) AS days,
  (SELECT json_agg(jsonb_build_object(
    'tripId', tdl.trip_id,
    'dayNo', tdl.day_no,
    'poiId', tdl.poi_id
  ))
  FROM trips_days_locations tdl
  WHERE tdl.trip_id = trips.id
  ) AS locations,
  COALESCE(json_agg(DISTINCT jsonb_build_object(
    'poi', to_jsonb(poi.*),
    'poiCategory', to_jsonb(cat.*),
    'poiAddress', to_jsonb(addr.*),
    'poiCity', to_jsonb(cities.*),
    'poiAmenities', COALESCE(poi_amenities.amenities, '[]'),
    'poiMedia', COALESCE(poi_media.media, '[]')
  )) FILTER (WHERE trips_days_locations.poi_id IS NOT NULL), '[]') AS ps
FROM trips
LEFT JOIN users u ON u.id = trips.owner_id
LEFT JOIN trips_days ON trips_days.trip_id = trips.id
LEFT JOIN trips_days_locations ON trips_days_locations.trip_id = trips.id AND trips_days_locations.day_no = trips_days.day_no
LEFT JOIN pois poi ON poi.id = trips_days_locations.poi_id
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
GROUP BY trips.id, u.id;

-- name: GetAllTripsIds :many
SELECT DISTINCT trips.id, trips.created_at
FROM trips
LEFT JOIN trips_participants tp ON tp.trip_id = trips.id
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
FROM trips_invites invites
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
FROM trips_invites invites
JOIN profile pfrom ON pfrom.id = invites.from_id
JOIN profile pto ON pto.id = invites.to_id
WHERE invites.trip_id = $1
ORDER BY invites.sent_at DESC;

-- name: CreateTripInvite :one
INSERT INTO trips_invites (
  id,
  trip_id,
  from_id,
  to_id,
  sent_at,
  expires_at,
  role
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7
) RETURNING *;
