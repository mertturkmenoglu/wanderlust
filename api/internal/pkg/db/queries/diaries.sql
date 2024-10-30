-- name: CreateNewDiaryEntry :one
INSERT INTO diary_entries (
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

-- name: CreateDiaryEntryPoi :one
INSERT INTO diary_entries_pois (
  diary_entry_id,
  poi_id,
  description,
  list_index
) VALUES (
  $1,
  $2,
  $3,
  $4
) RETURNING *;

-- name: CreateDiaryEntryUser :one
INSERT INTO diary_entries_users (
  diary_entry_id,
  user_id,
  list_index
) VALUES (
  $1,
  $2,
  $3
) RETURNING *;

-- name: CreateDiaryMedia :one
INSERT INTO diary_media (
  diary_entry_id,
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

-- name: GetDiaryEntryById :one
SELECT 
  sqlc.embed(diary_entries), 
  sqlc.embed(profile)
FROM diary_entries
  LEFT JOIN profile ON diary_entries.user_id = profile.id
WHERE diary_entries.id = $1 LIMIT 1;

-- name: GetDiaryEntryUsers :many
SELECT 
  sqlc.embed(diary_entries_users),
  sqlc.embed(profile)
FROM diary_entries_users
  JOIN profile ON diary_entries_users.user_id = profile.id
WHERE diary_entries_users.diary_entry_id = $1
ORDER BY diary_entries_users.list_index ASC;

-- name: GetDiaryEntryPois :many
SELECT 
  sqlc.embed(diary_entries_pois),
  sqlc.embed(pois),
  sqlc.embed(categories),
  sqlc.embed(addresses),
  sqlc.embed(cities),
  sqlc.embed(media)
FROM diary_entries_pois
  LEFT JOIN pois ON diary_entries_pois.poi_id = pois.id
  LEFT JOIN categories ON categories.id = pois.category_id
  LEFT JOIN addresses ON addresses.id = pois.address_id
  LEFT JOIN cities ON addresses.city_id = cities.id
  LEFT JOIN media ON media.poi_id = pois.id
WHERE diary_entries_pois.diary_entry_id = $1 AND media.media_order = 1
ORDER BY diary_entries_pois.list_index ASC;

-- name: ListDiaryEntries :many
SELECT * FROM diary_entries
WHERE user_id = $1;

-- name: ChangeShareWithFriends :exec
UPDATE diary_entries
SET share_with_friends = not share_with_friends
WHERE id = $1;