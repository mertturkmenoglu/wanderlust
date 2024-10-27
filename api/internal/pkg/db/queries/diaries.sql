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

