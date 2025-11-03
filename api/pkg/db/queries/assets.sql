-- name: FindReviewLastAssetIndex :one
SELECT
  COALESCE(MAX("order"), -1)
FROM
  public.assets
WHERE
  entity_id = $1 AND entity_type = 'review';

-- name: CreateReviewAsset :one
INSERT INTO assets (
  entity_type,
  entity_id,
  url,
  asset_type,
  description,
  "order"
) VALUES (
  'review',
  $1,
  $2,
  $3,
  $4,
  $5
) RETURNING *;

-- name: BatchCreateReviewAssets :copyfrom
INSERT INTO assets (
  entity_type,
  entity_id,
  url,
  asset_type,
  description,
  "order"
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6
);

-- name: BatchCreatePlaceAssets :copyfrom
INSERT INTO assets (
  entity_type,
  entity_id,
  url,
  asset_type,
  description,
  "order"
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6
);