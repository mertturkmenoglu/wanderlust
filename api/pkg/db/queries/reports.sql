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

-- name: FindReportById :one
SELECT *
FROM reports
WHERE id = $1
LIMIT 1;

-- name: FindManyReports :many
SELECT *
FROM reports
ORDER BY created_at DESC
OFFSET $1
LIMIT $2;

-- name: CountReports :one
SELECT COUNT(*) FROM reports;

-- name: UpdateReport :execresult
UPDATE reports SET
  description = $2,
  reason = $3,
  resolved = $4,
  resolved_at = $5,
  updated_at = $6
WHERE id = $1;

-- name: RemoveReportById :execresult
DELETE FROM reports
WHERE id = $1;
