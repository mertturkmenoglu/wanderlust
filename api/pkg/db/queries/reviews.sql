-- name: CountPoiReviews :one
SELECT COUNT(*) FROM reviews
WHERE poi_id = $1;

-- name: CreateReview :one
INSERT INTO reviews (
  id,
  poi_id,
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
  poi_id,
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

-- name: DeleteReview :exec
DELETE FROM reviews
WHERE id = $1;

-- name: GetReviewIdsByPoiIdFiltered :many
SELECT 
  id
FROM reviews
WHERE 
    poi_id = sqlc.arg(poiId)::TEXT
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

-- name: CountReviewsByPoiId :one
SELECT COUNT(*) FROM reviews
WHERE poi_id = $1;

-- name: GetLastReviewImageIndex :one
SELECT COALESCE(MAX(index), 0)
FROM review_images
WHERE review_id = $1;

-- name: BatchCreateReviewImage :copyfrom
INSERT INTO review_images(
  review_id,
  url,
  index
) VALUES (
  $1,
  $2,
  $3
);

-- name: GetReviewIdsByUsername :many
SELECT 
  reviews.id
FROM reviews
JOIN profile ON reviews.user_id = profile.id
WHERE profile.username = $1
ORDER BY reviews.created_at DESC
OFFSET $2
LIMIT $3;

-- name: CountReviewsByUsername :one
SELECT COUNT(*) FROM reviews
WHERE user_id = (
  SELECT id FROM profile
  WHERE username = $1
);

-- name: GetPoiRatings :many
SELECT rating, COUNT(rating) FROM reviews
WHERE poi_id = $1
GROUP BY rating;

-- name: GetReviewsByIds :many
SELECT
  sqlc.embed(reviews),
  sqlc.embed(profile),
  images_agg.images
FROM
  reviews
LEFT JOIN profile ON reviews.user_id = profile.id
LEFT JOIN LATERAL (
  SELECT json_agg(jsonb_build_object(
    'id', m.id,
    'reviewId', m.review_id,
    'url', m.url,
    'index', m.index
  ) ORDER BY m.index) AS images
  FROM public.review_images m
  WHERE m.review_id = reviews.id
) images_agg ON true
WHERE reviews.id = ANY($1::TEXT[])
ORDER BY reviews.created_at DESC;

-- name: GetReviewImagesByPoiId :many
SELECT * FROM review_images WHERE review_id IN (
  SELECT id FROM reviews WHERE poi_id = $1
  ORDER BY created_at DESC
) LIMIT 20;

-- name: GetPoiTotalRating :one
SELECT SUM(rating) FROM reviews
WHERE poi_id = $1;