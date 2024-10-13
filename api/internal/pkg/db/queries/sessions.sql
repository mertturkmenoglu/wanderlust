-- name: GetSessionById :one
SELECT sqlc.embed(sessions), sqlc.embed(users) FROM sessions
JOIN users ON users.id = sessions.user_id
WHERE sessions.id = $1 LIMIT 1;

-- name: CreateSession :one
INSERT INTO sessions (
  id,
  user_id,
  session_data,
  created_at,
  expires_at
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5
)
RETURNING *;

-- name: DeleteSessionById :exec
DELETE FROM sessions
WHERE id = $1 AND user_id = $2;
