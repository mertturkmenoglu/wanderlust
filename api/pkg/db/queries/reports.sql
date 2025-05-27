-- name: CreateReport :one
INSERT INTO reports (
  id,
  resource_id,
  resource_type,
  reporter_id,
  description,
  reason
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6
) RETURNING *;

-- name: BatchCreateReports :copyfrom
INSERT INTO reports (
  id,
  resource_id,
  resource_type,
  reporter_id,
  description,
  reason
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6
);

-- name: GetReportById :one
SELECT * FROM reports WHERE id = $1 LIMIT 1;

-- name: GetReportsPaginated :many
SELECT * FROM reports
ORDER BY created_at DESC
OFFSET $1
LIMIT $2;

-- name: UpdateReport :exec
UPDATE reports SET
  description = $2,
  reason = $3,
  resolved = $4,
  resolved_at = $5
WHERE id = $1;

-- name: DeleteReport :exec
DELETE FROM reports WHERE id = $1;
