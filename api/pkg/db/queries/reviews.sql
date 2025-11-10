-- name: CountReviewsByPlaceId :one
SELECT COUNT(*)
FROM reviews
WHERE place_id = $1;

-- name: CreateReview :one
INSERT INTO reviews (
  id,
  place_id,
  user_id,
  content,
  rating
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5
) RETURNING *;

-- name: BatchCreateReviews :copyfrom
INSERT INTO reviews (
  id,
  place_id,
  user_id,
  content,
  rating
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5
);

-- name: RemoveReview :execresult
DELETE FROM reviews
WHERE id = $1;

-- name: FindManyReviewIdsByPlaceIdAndRating :many
SELECT
  id
FROM reviews
WHERE
    place_id = sqlc.arg(placeId)::TEXT
  AND
    (rating >= COALESCE(sqlc.arg(minRating), rating))
  AND
    (rating <= COALESCE(sqlc.arg(maxRating), rating))
ORDER BY
  CASE WHEN sqlc.arg(sortBy)::TEXT = 'created_at' AND sqlc.arg(sortOrd)::TEXT = 'desc' THEN created_at END DESC,
  CASE WHEN sqlc.arg(sortBy)::TEXT = 'created_at' AND sqlc.arg(sortOrd)::TEXT = 'asc' THEN created_at END ASC,
  CASE WHEN sqlc.arg(sortBy)::TEXT = 'rating' AND sqlc.arg(sortOrd)::TEXT = 'desc' THEN rating END DESC,
  CASE WHEN sqlc.arg(sortBy)::TEXT = 'rating' AND sqlc.arg(sortOrd)::TEXT = 'asc' THEN rating END ASC
OFFSET $1
LIMIT $2;

-- name: CountReviewsByPlaceIdAndRating :one
SELECT COUNT(*)
FROM reviews
WHERE
    place_id = sqlc.arg(placeId)::TEXT
  AND
    (rating >= COALESCE(sqlc.arg(minRating), rating))
  AND
    (rating <= COALESCE(sqlc.arg(maxRating), rating));

-- name: FindManyReviewIdsByUsername :many
SELECT
  reviews.id
FROM reviews
  JOIN profile ON reviews.user_id = profile.id
WHERE profile.username = $1
ORDER BY reviews.created_at DESC
OFFSET $2
LIMIT $3;

-- name: CountReviewsByUsername :one
SELECT COUNT(*)
FROM reviews
WHERE user_id = (
  SELECT id FROM profile
  WHERE username = $1
);

-- name: FindPlaceRatings :many
SELECT
  rating,
  COUNT(rating)
FROM reviews
WHERE place_id = $1
GROUP BY rating;

-- name: FindManyReviewsById :many
SELECT
  sqlc.embed(reviews),
  sqlc.embed(profile),
  assets_agg.assets
FROM
  reviews
LEFT JOIN
  profile ON reviews.user_id = profile.id
LEFT JOIN LATERAL (
  SELECT json_agg(jsonb_build_object(
    'id', a.id,
    'reviewId', a.entity_id,
    'url', a.url,
    'order', a.order
  ) ORDER BY a.order) AS assets
  FROM public.assets a
  WHERE a.entity_id = reviews.id AND a.entity_type = 'review'
) assets_agg ON true
WHERE reviews.id = ANY($1::TEXT[])
ORDER BY reviews.created_at DESC;

-- name: FindManyReviewAssetsByPlaceId :many
SELECT *
FROM assets
WHERE entity_type = 'review' AND entity_id IN (
  SELECT id FROM reviews WHERE place_id = $1
  ORDER BY created_at DESC
) LIMIT 20;

-- name: FindPlaceTotalRating :one
SELECT COALESCE(SUM(rating), 0)
FROM reviews
WHERE place_id = $1;
