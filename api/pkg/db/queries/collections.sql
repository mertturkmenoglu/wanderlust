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

-- name: DeleteCollection :exec
DELETE FROM collections
WHERE id = $1;

-- name: GetCollectionIds :many
SELECT id FROM collections
OFFSET $1
LIMIT $2;

-- name: GetCollections :many
SELECT 
  sqlc.embed(collections),
  (SELECT json_agg(DISTINCT jsonb_build_object(
    'collectionId', items.collection_id,
    'poiId', items.poi_id,
    'index', items.index,
    'createdAt', items.created_at
  ))
  FROM collection_items items
  WHERE items.collection_id = collections.id
  ) AS items,
  (SELECT get_pois(
    ARRAY(
      SELECT 
        DISTINCT poi_id 
      FROM collection_items 
      WHERE collection_id = collections.id
    )
  )) AS pois
FROM collections
WHERE collections.id = ANY($1::TEXT[])
GROUP BY collections.id;

-- name: UpdateCollection :exec
UPDATE collections
SET 
  name = $1,
  description = $2
WHERE id = $3;

-- name: CountCollections :one
SELECT count(*) FROM collections;

-- name: CreateCollectionItem :one
INSERT INTO collection_items (
  collection_id,
  poi_id,
  index
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
WHERE collection_id = $1 AND index = $2;

-- name: DecrListIndexAfterDelete :exec
UPDATE collection_items
SET 
  list_index = list_index - 1
WHERE collection_id = $1 AND index > $2;

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
