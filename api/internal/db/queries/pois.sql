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
  open_times
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

-- name: RandSelectPois :many
SELECT id
FROM pois
ORDER BY RANDOM()
LIMIT $1;

-- name: PeekPois :many
SELECT * FROM pois
LIMIT 25;
