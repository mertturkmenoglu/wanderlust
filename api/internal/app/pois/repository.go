package pois

import (
	"context"
	"wanderlust/internal/db"
)

func (r *repository) peekPois() ([]db.Poi, error) {
	return r.db.Queries.PeekPois(context.Background())
}
