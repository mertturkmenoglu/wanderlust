-- name: CreateAmenity :one
INSERT INTO amenities (
  name
) VALUES (
  $1
) RETURNING *;

-- name: BatchCreateAmenitiesPois :copyfrom
INSERT INTO amenities_pois (
  amenity_id,
  poi_id
) VALUES (
  $1,
  $2
);

-- name: GetAllAmenities :many
SELECT *
FROM amenities;
