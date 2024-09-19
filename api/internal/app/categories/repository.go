package categories

import (
	"context"
	"wanderlust/internal/db"
)

func (r *repository) getCategories() ([]db.Category, error) {
	return r.db.Queries.GetCategories(context.Background())
}
