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

-- name: GetCollectionsByIdsPopulated :many
SELECT
  col.*,
  COALESCE(json_agg(DISTINCT jsonb_build_object(
    'index', ci.list_index,
    'created_at', ci.created_at,
    'poi', to_jsonb(poi.*),
    'poiCategory', to_jsonb(cat.*),
    'poiAddress', to_jsonb(addr.*),
    'poiCity', to_jsonb(cities.*),
    'poiAmenities', COALESCE(poi_amenities.amenities, '[]'),
    'poiMedia', COALESCE(poi_media.media, '[]')
  )) FILTER (WHERE ci.collection_id IS NOT NULL), '[]') AS items
FROM collections col
LEFT JOIN collection_items ci ON ci.collection_id = col.id
LEFT JOIN pois poi ON poi.id = ci.poi_id
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

WHERE col.id = ANY($1::TEXT[])

GROUP BY col.id;
