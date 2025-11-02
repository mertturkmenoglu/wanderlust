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

-- name: FindListById :one
SELECT
  sqlc.embed(lists),
  sqlc.embed(profile)
FROM lists
  LEFT JOIN profile ON profile.id = lists.user_id
WHERE lists.id = $1
LIMIT 1;

-- name: RemoveList :execresult
DELETE FROM lists
WHERE id = $1;

-- name: FindManyListsByUserId :many
SELECT *
FROM lists
WHERE user_id = $1
ORDER BY created_at DESC
OFFSET $2
LIMIT $3;

-- name: FindManyListsByUserIdAndIsPublic :many
SELECT *
FROM lists
WHERE user_id = $1 AND is_public = true
ORDER BY created_at DESC
OFFSET $2
LIMIT $3;

-- name: UpdateList :execresult
UPDATE lists
SET
  name = $2,
  is_public = $3
WHERE id = $1;

-- name: FindManyListItems :many
SELECT
  sqlc.embed(list_items),
  get_places(
    ARRAY(
      SELECT place_id
      FROM list_items
      WHERE list_items.list_id = $1
    )
  ) as places
FROM list_items
WHERE list_id = $1
ORDER BY index ASC;

-- name: CountListsByUserId :one
SELECT COUNT(*)
FROM lists
WHERE user_id = $1;

-- name: CountListsByUserIdAndIsPublic :one
SELECT COUNT(*)
FROM lists
WHERE user_id = $1 AND is_public = true;

-- name: CreateListItem :one
INSERT INTO list_items (
  list_id,
  place_id,
  index
) VALUES (
  $1,
  $2,
  $3
) RETURNING *;

-- name: BatchCreateListItems :copyfrom
INSERT INTO list_items (
  list_id,
  place_id,
  index
) VALUES (
  $1,
  $2,
  $3
);

-- name: FindListLastIndexById :one
SELECT COALESCE(MAX(index), 0)
FROM list_items
WHERE list_id = $1;

-- name: CountListItemsByListId :one
SELECT COUNT(*)
FROM list_items
WHERE list_id = $1;

-- name: FindListItemByListIdAndPlaceId :one
SELECT *
FROM list_items
WHERE list_id = $1 AND place_id = $2
LIMIT 1;

-- name: RemoveListItemsByListId :execresult
DELETE FROM list_items
WHERE list_id = $1;

-- name: FindListIdAndNameByUserId :many
SELECT id, name
FROM lists
WHERE user_id = $1;

-- name: CheckManyPlaceInListStatus :many
SELECT list_id, place_id
FROM list_items
WHERE list_items.place_id = $1 AND list_items.list_id = ANY($2::TEXT[]);
