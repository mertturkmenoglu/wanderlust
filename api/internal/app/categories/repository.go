package categories

import (
	"context"
	"wanderlust/internal/pkg/db"
)

func (r *repository) getCategories() ([]db.Category, error) {
	return r.db.Queries.GetCategories(context.Background())
}

func (r *repository) deleteCategory(id int16) error {
	return r.db.Queries.DeleteCategory(context.Background(), id)
}

func (r *repository) createCategory(dto CreateCategoryRequestDto) (db.Category, error) {
	return r.db.Queries.CreateCategory(context.Background(), db.CreateCategoryParams{
		ID:    dto.ID,
		Name:  dto.Name,
		Image: dto.Image,
	})
}

func (r *repository) updateCategory(id int16, dto UpdateCategoryRequestDto) (db.Category, error) {
	return r.db.Queries.UpdateCategory(context.Background(), db.UpdateCategoryParams{
		ID:    id,
		Name:  dto.Name,
		Image: dto.Image,
	})
}
