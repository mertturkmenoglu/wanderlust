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

-- name: UserReviewCountForPoi :one
SELECT COUNT(*) FROM reviews
WHERE poi_id = $1 AND user_id = $2;

-- name: LastReviewOfUserForPoi :one
SELECT * FROM reviews
WHERE poi_id = $1 AND user_id = $2
ORDER BY created_at DESC
LIMIT 1;

-- name: SetPreviousReviewRatings :exec
UPDATE reviews
SET rating = $3
WHERE poi_id = $1 AND user_id = $2;

-- name: GetReviewById :one
SELECT
  sqlc.embed(reviews),
  sqlc.embed(profile),
  sqlc.embed(pois)
FROM reviews
LEFT JOIN profile ON profile.id = reviews.user_id
LEFT JOIN pois ON reviews.poi_id = pois.id
WHERE reviews.id = $1
LIMIT 1;

-- name: GetReviewMedia :many
SELECT * FROM review_media
WHERE review_id = $1;

-- name: DeleteReview :exec
DELETE FROM reviews
WHERE id = $1;

-- name: GetReviewsByPoiId :many
SELECT 
  sqlc.embed(reviews),
  sqlc.embed(profile),
  sqlc.embed(pois)
FROM 
    reviews
JOIN 
    profile ON reviews.user_id = profile.id
JOIN 
    pois ON reviews.poi_id = pois.id
WHERE reviews.poi_id = $1
ORDER BY reviews.created_at DESC
OFFSET $2
LIMIT $3;

-- name: CountReviewsByPoiId :one
SELECT COUNT(*) FROM reviews
WHERE poi_id = $1;

-- name: GetReviewMediaByReviewIds :many
SELECT * FROM review_media
WHERE review_id = ANY($1::TEXT[]);

-- name: GetLastMediaOrderOfReview :one
SELECT COALESCE(MAX(media_order), 0)
FROM review_media
WHERE review_id = $1;

-- name: CreateReviewMedia :one
INSERT INTO review_media (
  review_id,
  url,
  media_order
) VALUES (
  $1,
  $2,
  $3
) RETURNING *;

-- name: BatchCreateReviewMedia :copyfrom
INSERT INTO review_media (
  review_id,
  url,
  media_order
) VALUES (
  $1,
  $2,
  $3
);

-- name: GetReviewsByUsername :many
SELECT 
  sqlc.embed(reviews),
  sqlc.embed(profile),
  sqlc.embed(pois)
FROM 
    reviews
JOIN 
    profile ON reviews.user_id = profile.id
JOIN 
    pois ON reviews.poi_id = pois.id
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

-- name: GetReviewsByIdsPopulated :many
SELECT
  sqlc.embed(reviews),
  sqlc.embed(profile),
  sqlc.embed(pois),
  media_agg.media
FROM
  reviews
LEFT JOIN profile ON reviews.user_id = profile.id
LEFT JOIN pois ON reviews.poi_id = pois.id
LEFT JOIN LATERAL (
  SELECT json_agg(jsonb_build_object(
    'id', m.id,
    'url', m.url,
    'review_id', m.review_id,
    'media_order', m.media_order
  ) ORDER BY m.media_order) AS media
  FROM review_media m
  WHERE m.review_id = reviews.id
) media_agg ON true
WHERE reviews.id = ANY($1::TEXT[])
ORDER BY reviews.created_at DESC;
