-- name: CreateList :one
INSERT INTO lists (
  id,
  name,
  user_id,
  is_public
) VALUES (
  $1,
  $2,
  $3,
  $4
) RETURNING *;

-- name: GetListById :one
SELECT 
  sqlc.embed(lists), 
  sqlc.embed(users)
FROM lists
  LEFT JOIN users ON users.id = lists.user_id
WHERE lists.id = $1 LIMIT 1;

-- name: DeleteList :exec
DELETE FROM lists
WHERE id = $1;

-- name: GetAllListsOfUser :many
SELECT * FROM lists
WHERE user_id = $1
ORDER BY created_at DESC
OFFSET $2
LIMIT $3;

-- name: GetPublicListsOfUser :many
SELECT * FROM lists
WHERE user_id = $1 AND is_public = true
ORDER BY created_at DESC
OFFSET $2
LIMIT $3;

-- name: UpdateList :exec
UPDATE lists
SET 
  name = $2,
  is_public = $3
WHERE id = $1;

-- name: GetListItems :many
SELECT
  sqlc.embed(list_items),
  sqlc.embed(pois),
  sqlc.embed(categories),
  sqlc.embed(addresses),
  sqlc.embed(cities),
  sqlc.embed(media)
  FROM list_items
INNER JOIN pois ON list_items.poi_id = pois.id
LEFT JOIN categories ON pois.category_id = categories.id
LEFT JOIN addresses ON pois.address_id = addresses.id
LEFT JOIN cities ON addresses.city_id = cities.id
LEFT JOIN media ON pois.id = media.poi_id
WHERE media.media_order = 1 AND list_items.list_id = $1
ORDER BY list_items.list_index ASC;

-- name: CountAllListsOfUser :one
SELECT COUNT(*) FROM lists
WHERE user_id = $1;

-- name: CountPublicListsOfUser :one
SELECT COUNT(*) FROM lists
WHERE user_id = $1 AND is_public = true;

-- name: CreateListItem :one
INSERT INTO list_items (
  list_id,
  poi_id,
  list_index
) VALUES (
  $1,
  $2,
  $3
) RETURNING *;

-- name: GetLastIndexOfList :one
SELECT COALESCE(MAX(list_index), 0)
FROM list_items
WHERE list_id = $1;

-- name: GetListItem :one
SELECT * FROM list_items
WHERE list_id = $1 AND poi_id = $2
LIMIT 1;

-- name: DeleteListsListItemAtIndex :exec
DELETE FROM list_items
WHERE list_id = $1 AND list_index = $2;

-- name: DecrListItemsListIndexAfterDelete :exec
UPDATE list_items
SET
  list_index = list_index - 1
WHERE list_id = $1 AND list_index > $2;

-- name: DeleteAllListItems :exec
DELETE FROM list_items
WHERE list_id = $1;

-- name: GetListIdsAndNamesOfUser :many
SELECT id, name FROM lists
WHERE user_id = $1;

-- name: GetListItemsInListStatus :many
SELECT list_id, poi_id FROM list_items
WHERE list_items.poi_id = $1 AND list_items.list_id = ANY($2::TEXT[]);
