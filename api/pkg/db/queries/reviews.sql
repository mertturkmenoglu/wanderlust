-- name: CountPoiReviews :one
SELECT COUNT(*) FROM reviews
WHERE poi_id = $1;

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

-- name: GetReviewIdsByPoiId :many
SELECT 
  id
FROM reviews
WHERE poi_id = $1
ORDER BY created_at DESC
OFFSET $2
LIMIT $3;

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
  sqlc.embed(profile)
FROM
  reviews
LEFT JOIN profile ON reviews.user_id = profile.id
WHERE reviews.id = ANY($1::TEXT[])
ORDER BY reviews.created_at DESC;
