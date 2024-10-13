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

-- name: CreateOnePoi :one
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
) RETURNING *;

-- name: RandSelectPois :many
SELECT id
FROM pois
ORDER BY RANDOM()
LIMIT $1;

-- name: PeekPois :many
SELECT * FROM pois
LIMIT 25;

-- name: CountPois :one
SELECT COUNT(*) FROM pois;

-- name: GetPaginatedPoiIds :many
SELECT id FROM pois
ORDER BY created_at ASC
OFFSET $1
LIMIT $2;

-- name: GetPoiById :one
SELECT sqlc.embed(pois), sqlc.embed(addresses), sqlc.embed(categories), sqlc.embed(cities) FROM pois
LEFT JOIN addresses ON addresses.id = pois.address_id
LEFT JOIN categories ON categories.id = pois.category_id
LEFT JOIN cities ON cities.id = addresses.city_id
WHERE pois.id = $1 LIMIT 1;

-- name: GetPoiMedia :many
SELECT * FROM media
WHERE poi_id = $1
ORDER BY media_order;

-- name: GetPoiAmenities :many
SELECT sqlc.embed(amenities_pois), sqlc.embed(amenities) FROM amenities_pois
LEFT JOIN amenities ON amenities.id = amenities_pois.amenity_id
WHERE poi_id = $1
ORDER BY amenity_id;

-- name: CreatePoiMedia :one
INSERT INTO media (
  poi_id,
  url,
  alt,
  caption,
  media_order
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5
) RETURNING *;

-- name: GetFavoritePois :many
SELECT
  sqlc.embed(pois),
  sqlc.embed(categories),
  sqlc.embed(addresses),
  sqlc.embed(cities),
  sqlc.embed(media)
FROM pois
  LEFT JOIN categories ON categories.id = pois.category_id
  LEFT JOIN addresses ON addresses.id = pois.address_id
  LEFT JOIN cities ON addresses.city_id = cities.id
  LEFT JOIN media ON media.poi_id = pois.id
WHERE media.media_order = 1
ORDER BY total_favorites DESC
LIMIT 25;

-- name: GetFeaturedPois :many
SELECT 
  sqlc.embed(pois),
  sqlc.embed(categories),
  sqlc.embed(addresses),
  sqlc.embed(cities),
  sqlc.embed(media)
FROM pois
  LEFT JOIN categories ON categories.id = pois.category_id
  LEFT JOIN addresses ON addresses.id = pois.address_id
  LEFT JOIN cities ON addresses.city_id = cities.id
  LEFT JOIN media ON media.poi_id = pois.id
WHERE total_votes != 0 AND media.media_order = 1
ORDER BY total_points / total_votes DESC, total_votes DESC
LIMIT 25;

-- name: GetPopularPois :many
SELECT
  sqlc.embed(pois),
  sqlc.embed(categories),
  sqlc.embed(addresses),
  sqlc.embed(cities),
  sqlc.embed(media)
FROM pois
  LEFT JOIN categories ON categories.id = pois.category_id
  LEFT JOIN addresses ON addresses.id = pois.address_id
  LEFT JOIN cities ON addresses.city_id = cities.id
  LEFT JOIN media ON media.poi_id = pois.id
WHERE media.media_order = 1
ORDER BY total_votes DESC
LIMIT 25;

-- name: GetNewPois :many
SELECT 
  sqlc.embed(pois),
  sqlc.embed(categories),
  sqlc.embed(addresses),
  sqlc.embed(cities),
  sqlc.embed(media)
FROM pois
  LEFT JOIN categories ON categories.id = pois.category_id
  LEFT JOIN addresses ON addresses.id = pois.address_id
  LEFT JOIN cities ON addresses.city_id = cities.id
  LEFT JOIN media ON media.poi_id = pois.id
WHERE media.media_order = 1
ORDER BY pois.created_at DESC
LIMIT 25;
