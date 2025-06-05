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

-- name: BatchCreateLists :copyfrom
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
);

-- name: GetListById :one
SELECT 
  sqlc.embed(lists), 
  sqlc.embed(profile)
FROM lists
  LEFT JOIN profile ON profile.id = lists.user_id
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
  get_pois(
    ARRAY(
      SELECT poi_id FROM list_items
      WHERE list_items.list_id = $1
    )
  ) as pois
FROM list_items
WHERE list_id = $1
ORDER BY index ASC;

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
  index
) VALUES (
  $1,
  $2,
  $3
) RETURNING *;

-- name: BatchCreateListItems :copyfrom
INSERT INTO list_items (
  list_id,
  poi_id,
  index
) VALUES (
  $1,
  $2,
  $3
);

-- name: GetLastIndexOfList :one
SELECT COALESCE(MAX(index), 0)
FROM list_items
WHERE list_id = $1;

-- name: CountListItems :one
SELECT COUNT(*) FROM list_items
WHERE list_id = $1;

-- name: GetListItem :one
SELECT * FROM list_items
WHERE list_id = $1 AND poi_id = $2
LIMIT 1;

-- name: DeleteAllListItems :exec
DELETE FROM list_items
WHERE list_id = $1;

-- name: GetListIdsAndNamesOfUser :many
SELECT id, name FROM lists
WHERE user_id = $1;

-- name: GetListItemsInListStatus :many
SELECT list_id, poi_id FROM list_items
WHERE list_items.poi_id = $1 AND list_items.list_id = ANY($2::TEXT[]);
