-- name: BatchCreatePois :copyfrom
INSERT INTO pois (
  id,
  name,
  phone,
  description,
  address_id,
  website,
  price_level,
  accessibility_level,
  total_votes,
  total_points,
  total_favorites,
  category_id,
  hours
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
  $13
);

-- name: RandSelectPoiIds :many
SELECT id
FROM pois
ORDER BY RANDOM()
LIMIT $1;

-- name: CountPois :one
SELECT COUNT(*) FROM pois;

-- name: GetPaginatedPoiIds :many
SELECT id FROM pois
ORDER BY created_at ASC
OFFSET $1
LIMIT $2;

-- name: CreatePoiMedia :one
INSERT INTO media (
  poi_id,
  url,
  alt,
  index
) VALUES (
  $1,
  $2,
  $3,
  $4
) RETURNING *;

-- name: GetFavoritePoisIds :many
SELECT 
  id 
FROM 
  pois 
ORDER BY total_favorites DESC 
LIMIT 25;

-- name: GetFeaturedPoisIds :many
SELECT 
  id 
FROM 
  pois
WHERE total_votes != 0
ORDER BY total_points / total_votes DESC, total_votes DESC
LIMIT 25;

-- name: GetPopularPoisIds :many
SELECT 
  id 
FROM 
  pois
ORDER BY total_votes DESC
LIMIT 25;

-- name: GetNewPoisIds :many
SELECT 
  id 
FROM 
  pois
ORDER BY created_at DESC
LIMIT 25;

-- name: IncrementTotalVotes :exec
UPDATE pois
SET total_votes = total_votes + 1
WHERE id = $1;

-- name: IncrementTotalPoints :exec
UPDATE pois
SET total_points = total_points + $2
WHERE id = $1;

-- name: GetPoisByIdsPopulated :many
SELECT get_pois($1::TEXT[]);

-- name: UpdatePoiInfo :exec
UPDATE pois
SET
  name = $1,
  category_id = $2,
  description = $3,
  phone = $4,
  website = $5,
  accessibility_level = $6,
  price_level = $7
WHERE id = $8;

-- name: DeletePoiAllAmenities :exec
DELETE FROM amenities_pois
WHERE poi_id = $1;

-- name: UpdatePoiHours :exec
UPDATE pois
SET hours = $1
WHERE id = $2;
