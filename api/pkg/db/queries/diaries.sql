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

-- name: BatchCreateDiaryEntryLocations :copyfrom
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
);

-- name: BatchCreateDiaryEntryUsers :copyfrom
INSERT INTO diary_entries_users (
  diary_entry_id,
  user_id,
  list_index
) VALUES (
  $1,
  $2,
  $3
);

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
WHERE user_id = $1
ORDER BY date DESC, created_at DESC
OFFSET $2
LIMIT $3;

-- name: CountDiaryEntries :one
SELECT COUNT(*) FROM diary_entries
WHERE user_id = $1;

-- name: ListAndFilterDiaryEntries :many
SELECT * FROM diary_entries
WHERE user_id = $1 AND date <= $2 AND date >= $3
ORDER BY date DESC, created_at DESC
OFFSET $4
LIMIT $5;

-- name: CountDiaryEntriesFilterByRange :one
SELECT COUNT(*) FROM diary_entries
WHERE user_id = $1 AND date <= $2 AND date >= $3;

-- name: GetDiaryMedia :many
SELECT * FROM diary_media
WHERE diary_entry_id = $1
ORDER BY media_order ASC;

-- name: GetLastMediaOrderOfEntry :one
SELECT COALESCE(MAX(media_order), 0)
FROM diary_media
WHERE diary_entry_id = $1;

-- name: DeleteDiaryEntry :exec
DELETE FROM diary_entries
WHERE id = $1;

-- name: GetDiaryEntriesByIdsPopulated :many
SELECT
  de.*,
	COALESCE(
    json_agg(DISTINCT to_jsonb(dm.*)) FILTER (WHERE dm.id IS NOT NULL), '[]') AS media,
	to_jsonb(u.*) as user,
  (SELECT json_agg(to_jsonb(pr.*))
   FROM diary_entries_users def
   JOIN profile pr ON pr.id = def.user_id
   WHERE def.diary_entry_id = de.id
  ) AS friends,
  COALESCE(
    json_agg(DISTINCT jsonb_build_object(
      'description', dl.description,
      'index', dl.list_index,
      'poiId', dl.poi_id
    )) FILTER (WHERE dl.diary_entry_id IS NOT NULL), '[]') AS locations,
  get_pois(
    ARRAY(
      SELECT poi_id
      FROM diary_entries_pois
      WHERE diary_entry_id = de.id
    )
  ) AS pois
FROM diary_entries de
LEFT JOIN users u ON u.id = de.user_id
LEFT JOIN diary_media dm ON de.id = dm.diary_entry_id
LEFT JOIN diary_entries_pois dl ON dl.diary_entry_id = de.id
WHERE de.id = ANY($1::TEXT[])

GROUP BY de.id, de.title, u.id;

-- name: UpdateDiaryEntry :one
UPDATE diary_entries
SET
  title = $2,
  description = $3,
  date = $4,
  share_with_friends = $5
WHERE id = $1
RETURNING *;

-- name: RemoveDiaryEntryFriends :exec
DELETE FROM 
  diary_entries_users
WHERE
  diary_entry_id = $1;

-- name: RemoveDiaryEntryLocations :exec
DELETE FROM 
  diary_entries_pois
WHERE
  diary_entry_id = $1;

-- name: RemoveDiaryEntryAllMedia :exec
DELETE FROM
  diary_media
WHERE
  diary_entry_id = $1;
