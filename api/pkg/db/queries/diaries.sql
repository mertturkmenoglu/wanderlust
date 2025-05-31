-- name: CreateNewDiary :one
INSERT INTO diaries (
  id,
  user_id,
  title,
  description,
  share_with_friends,
  date
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6
) RETURNING *;

-- name: BatchCreateDiaryLocations :copyfrom
INSERT INTO diary_pois (
  diary_id,
  poi_id,
  description,
  index
) VALUES (
  $1,
  $2,
  $3,
  $4
);

-- name: BatchCreateDiaryUsers :copyfrom
INSERT INTO diary_users (
  diary_id,
  user_id,
  index
) VALUES (
  $1,
  $2,
  $3
);

-- name: CreateDiaryImage :one
INSERT INTO diary_images (
  diary_id,
  url,
  index
) VALUES (
  $1,
  $2,
  $3
) RETURNING *;

-- name: GetDiaryById :one
SELECT 
  sqlc.embed(diaries), 
  sqlc.embed(profile)
FROM diaries
LEFT JOIN profile ON diaries.user_id = profile.id
WHERE diaries.id = $1 LIMIT 1;

-- name: GetDiaryUsers :many
SELECT 
  sqlc.embed(diary_users),
  sqlc.embed(profile)
FROM diary_users
JOIN profile ON diary_users.user_id = profile.id
WHERE diary_users.diary_id = $1
ORDER BY diary_users.index ASC;

-- name: GetDiaryPois :many
SELECT *
FROM diary_pois
WHERE diary_pois.diary_id = $1
ORDER BY diary_pois.index ASC;

-- name: ListDiaries :many
SELECT * FROM diaries
WHERE user_id = $1
ORDER BY date DESC, created_at DESC
OFFSET $2
LIMIT $3;

-- name: CountDiaries :one
SELECT COUNT(*) FROM diaries
WHERE user_id = $1;

-- name: ListAndFilterDiaries :many
SELECT * FROM diaries
WHERE user_id = $1 AND date <= $2 AND date >= $3
ORDER BY date DESC, created_at DESC
OFFSET $4
LIMIT $5;

-- name: CountDiariesFilterByRange :one
SELECT COUNT(*) FROM diaries
WHERE user_id = $1 AND date <= $2 AND date >= $3;

-- name: GetDiaryImages :many
SELECT * FROM diary_images
WHERE diary_id = $1
ORDER BY index ASC;

-- name: GetDiaryLastImageIndex :one
SELECT COALESCE(MAX(index), 0)
FROM diary_images
WHERE diary_id = $1;

-- name: DeleteDiary :exec
DELETE FROM diaries
WHERE id = $1;

-- name: UpdateDiary :one
UPDATE diaries
SET
  title = $2,
  description = $3,
  date = $4,
  share_with_friends = $5
WHERE id = $1
RETURNING *;

-- name: RemoveDiaryFriends :exec
DELETE FROM 
  diary_users
WHERE
  diary_id = $1;

-- name: RemoveDiaryLocations :exec
DELETE FROM 
  diary_pois
WHERE
  diary_id = $1;

-- name: RemoveDiaryAllImages :exec
DELETE FROM
  diary_images
WHERE
  diary_id = $1;
