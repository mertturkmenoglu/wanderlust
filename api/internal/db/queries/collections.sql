-- name: CreateCollection :one
INSERT INTO collections (
  id,
  name,
  description
) VALUES (
  $1,
  $2,
  $3
) RETURNING *;

-- name: GetCollectionById :one
SELECT * FROM collections
WHERE id = $1 LIMIT 1;

-- name: DeleteCollection :exec
DELETE FROM collections
WHERE id = $1;

-- name: GetCollections :many
SELECT * FROM collections
ORDER BY created_at DESC
OFFSET $1
LIMIT $2;

-- name: UpdateCollection :exec
UPDATE collections
SET 
  name = $1,
  description = $2
WHERE id = $3;

-- name: GetCollectionItems :many
SELECT 
  sqlc.embed(pois),
  sqlc.embed(categories),
  sqlc.embed(addresses),
  sqlc.embed(cities),
  sqlc.embed(media)
FROM pois
  LEFT JOIN categories ON pois.category_id = categories.id
  LEFT JOIN addresses ON pois.address_id = addresses.id
  LEFT JOIN cities ON addresses.city_id = cities.id
  LEFT JOIN media ON pois.id = media.poi_id
WHERE media.media_order = 1 AND pois.id IN (
  SELECT poi_id FROM collection_items
  WHERE collection_id = $1
);

-- name: CountCollections :one
SELECT count(*) FROM collections;