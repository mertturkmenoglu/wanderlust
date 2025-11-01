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

-- name: BatchCreateCollections :copyfrom
INSERT INTO collections (
  id,
  name,
  description
) VALUES (
  $1,
  $2,
  $3
);

-- name: RemoveCollectionById :execresult
DELETE FROM collections
WHERE id = $1;

-- name: FindManyCollectionIds :many
SELECT id FROM collections
ORDER BY created_at DESC
OFFSET $1
LIMIT $2;

-- name: UpdateCollection :execresult
UPDATE collections
SET
  name = $1,
  description = $2
WHERE id = $3;

-- name: CountCollections :one
SELECT COUNT(*) FROM collections;

-- name: CreateCollectionItem :one
INSERT INTO collection_items (
  collection_id,
  place_id,
  index
) VALUES (
  $1,
  $2,
  $3
) RETURNING *;

-- name: BatchCreateCollectionItems :copyfrom
INSERT INTO collection_items (
  collection_id,
  place_id,
  index
) VALUES (
  $1,
  $2,
  $3
);

-- name: FindCollectionLastIndexById :one
SELECT
  COALESCE(MAX(index), 0)
FROM collection_items
WHERE collection_id = $1;

-- name: FindCollectionItemByCollectionIdAndPlaceId :one
SELECT * FROM collection_items
WHERE collection_id = $1 AND place_id = $2
LIMIT 1;

-- name: RemoveCollectionItemByCollectionIdAndIndex :execresult
DELETE FROM collection_items
WHERE collection_id = $1 AND index = $2;

-- name: DecrementCollectionIndexAfterDelete :execresult
UPDATE collection_items
SET
  index = index - 1
WHERE collection_id = $1 AND index > $2;

-- name: RemoveCollectionItemsByCollectionId :execresult
DELETE FROM collection_items
WHERE collection_id = $1;

-- name: CreateCollectionPlaceRelation :one
INSERT INTO collections_places (
  collection_id,
  place_id,
  index
) VALUES (
  $1,
  $2,
  $3
) RETURNING *;

-- name: BatchCreateCollectionPlaceRelations :copyfrom
INSERT INTO collections_places (
  collection_id,
  place_id,
  index
) VALUES (
  $1,
  $2,
  $3
);

-- name: CreateCollectionCityRelation :one
INSERT INTO collections_cities (
  collection_id,
  city_id,
  index
) VALUES (
  $1,
  $2,
  $3
) RETURNING *;

-- name: BatchCreateCollectionCityRelations :copyfrom
INSERT INTO collections_cities (
  collection_id,
  city_id,
  index
) VALUES (
  $1,
  $2,
  $3
);

-- name: RemoveCollectionPlaceRelation :execresult
DELETE FROM collections_places
WHERE collection_id = $1 AND place_id = $2;

-- name: RemoveCollectionCityRelation :execresult
DELETE FROM collections_cities
WHERE collection_id = $1 AND city_id = $2;

-- name: FindManyCollectionIdsByPlaceId :many
SELECT collection_id FROM collections_places
WHERE place_id = $1;

-- name: FindManyCollectionIdsByCityId :many
SELECT collection_id FROM collections_cities
WHERE city_id = $1;

-- name: FindManyCollectionCityRelations :many
SELECT * FROM collections_cities;

-- name: FindManyCollectionPlaceRelations :many
SELECT * FROM collections_places;
