// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: reviews.sql

package db

import (
	"context"
)

const countPoiReviews = `-- name: CountPoiReviews :one
SELECT COUNT(*) FROM reviews
WHERE poi_id = $1
`

func (q *Queries) CountPoiReviews(ctx context.Context, poiID string) (int64, error) {
	row := q.db.QueryRow(ctx, countPoiReviews, poiID)
	var count int64
	err := row.Scan(&count)
	return count, err
}
