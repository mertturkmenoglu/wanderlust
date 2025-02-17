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
  sqlc.embed(collection_items),
  sqlc.embed(pois),
  sqlc.embed(categories),
  sqlc.embed(addresses),
  sqlc.embed(cities),
  sqlc.embed(media)
FROM collection_items
  INNER JOIN pois ON collection_items.poi_id = pois.id
  LEFT JOIN categories ON pois.category_id = categories.id
  LEFT JOIN addresses ON pois.address_id = addresses.id
  LEFT JOIN cities ON addresses.city_id = cities.id
  LEFT JOIN media ON pois.id = media.poi_id
WHERE media.media_order = 1 AND collection_items.collection_id = $1
ORDER BY collection_items.list_index ASC;

-- name: CountCollections :one
SELECT count(*) FROM collections;

-- name: CreateCollectionItem :one
INSERT INTO collection_items (
  collection_id,
  poi_id,
  list_index
) VALUES (
  $1,
  $2,
  $3
) RETURNING *;

-- name: GetLastIndexOfCollection :one
SELECT COALESCE(MAX(list_index), 0)
FROM collection_items
WHERE collection_id = $1;

-- name: GetCollectionItem :one
SELECT * FROM collection_items
WHERE collection_id = $1 AND poi_id = $2
LIMIT 1;

-- name: DeleteCollectionItemAtIndex :exec
DELETE FROM collection_items
WHERE collection_id = $1 AND list_index = $2;

-- name: DecrListIndexAfterDelete :exec
UPDATE collection_items
SET 
  list_index = list_index - 1
WHERE collection_id = $1 AND list_index > $2;

-- name: DeleteAllCollectionItems :exec
DELETE FROM collection_items
WHERE collection_id = $1;

-- name: CreateCollectionPoiRelation :exec
INSERT INTO collections_pois (
  collection_id,
  poi_id,
  index
) VALUES (
  $1,
  $2,
  $3
);

-- name: CreateCollectionCityRelation :exec
INSERT INTO collections_cities (
  collection_id,
  city_id,
  index
) VALUES (
  $1,
  $2,
  $3
);

-- name: RemoveCollectionPoiRelation :exec
DELETE FROM collections_pois
WHERE collection_id = $1 AND poi_id = $2;

-- name: RemoveCollectionCityRelation :exec
DELETE FROM collections_cities
WHERE collection_id = $1 AND city_id = $2;

-- name: GetCollectionIdsForPoi :many
SELECT collection_id FROM collections_pois
WHERE poi_id = $1;

-- name: GetCollectionsIdsForCity :many
SELECT collection_id FROM collections_cities
WHERE city_id = $1;

-- name: GetAllCityCollections :many
SELECT * FROM collections_cities;

-- name: GetAllPoiCollections :many
SELECT * FROM collections_pois;
