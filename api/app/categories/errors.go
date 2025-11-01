package categories

import "github.com/danielgtaylor/huma/v2"

var (
	ErrNoCategoryFound = huma.Error404NotFound("No category found")
	ErrFailedToList    = huma.Error500InternalServerError("Failed to list categories")
	ErrAlreadyExists   = huma.Error409Conflict("Category already exists")
	ErrFailedToCreate  = huma.Error500InternalServerError("Failed to create category")
	ErrNotFound        = huma.Error404NotFound("Category not found")
	ErrFailedToDelete  = huma.Error500InternalServerError("Failed to delete category")
	ErrFailedToUpdate  = huma.Error500InternalServerError("Failed to update category")
)
