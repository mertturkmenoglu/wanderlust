-- name: BatchCreatePlaces :copyfrom
INSERT INTO places (
  id,
  name,
  phone,
  description,
  website,
  address_id,
  category_id,
  price_level,
  accessibility_level,
  hours,
  amenities,
  total_votes,
  total_points,
  total_favorites
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8,
  $9,
  $10,
  $11,
  $12,
  $13,
  $14
);

-- name: CreatePlace :one
INSERT INTO places (
  id,
  name,
  phone,
  description,
  website,
  address_id,
  category_id,
  price_level,
  accessibility_level,
  hours,
  amenities,
  total_votes,
  total_points,
  total_favorites
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8,
  $9,
  $10,
  $11,
  $12,
  $13,
  $14
) RETURNING *;

-- name: FindManyPlaceIdsByRand :many
SELECT id
FROM places
ORDER BY RANDOM()
LIMIT $1;

-- name: CountPlaces :one
SELECT COUNT(*) FROM places;

-- name: FindManyPlaceIds :many
SELECT id
FROM places
ORDER BY created_at ASC
OFFSET $1
LIMIT $2;

-- name: FindManyFavoritePlaceIds :many
SELECT id
FROM places
ORDER BY total_favorites DESC
LIMIT 25;

-- name: FindManyFeaturedPlaceIds :many
SELECT id
FROM places
WHERE total_votes != 0
ORDER BY total_points / total_votes DESC, total_votes DESC
LIMIT 25;

-- name: FindManyPopularPlaceIds :many
SELECT id
FROM places
ORDER BY total_votes DESC
LIMIT 25;

-- name: FindManyNewPlaceIds :many
SELECT id
FROM places
ORDER BY created_at DESC
LIMIT 25;

-- name: IncrementPlaceTotalVotes :execresult
UPDATE places
SET total_votes = total_votes + 1
WHERE id = $1;

-- name: IncrementPlaceTotalPoints :execresult
UPDATE places
SET total_points = total_points + $2
WHERE id = $1;

-- name: IncrementPlaceTotalFavorites :execresult
UPDATE places
SET total_favorites = total_favorites + 1
WHERE id = $1;

-- name: DecrementPlaceTotalVotes :execresult
UPDATE places
SET total_votes = total_votes - 1
WHERE id = $1;

-- name: DecrementPlaceTotalPoints :execresult
UPDATE places
SET total_points = total_points - $2
WHERE id = $1;

-- name: DecrementPlaceTotalFavorites :execresult
UPDATE places
SET total_favorites = total_favorites - 1
WHERE id = $1;

-- name: FindManyPlacesPopulated :many
SELECT get_places($1::TEXT[]);

-- name: UpdatePlaceInfo :execresult
UPDATE places
SET
  name = $1,
  category_id = $2,
  description = $3,
  phone = $4,
  website = $5,
  accessibility_level = $6,
  price_level = $7
WHERE id = $8;

-- name: UpdatePlaceHours :execresult
UPDATE places
SET hours = $2
WHERE id = $1;

-- name: UpdatePlaceAmenities :execresult
UPDATE places
SET amenities = $2
WHERE id = $1;

-- name: UpdatePlaceTotalFavorites :execresult
UPDATE places
SET total_favorites = $2
WHERE id = $1;

-- name: UpdatePlaceRatingsAndVotes :execresult
UPDATE places
SET total_points = $2, total_votes = $3
WHERE id = $1;

