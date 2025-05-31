package mapper

import (
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
)

func ToCategory(dbCategory db.Category) dto.Category {
	return dto.Category{
		ID:    dbCategory.ID,
		Name:  dbCategory.Name,
		Image: dbCategory.Image,
	}
}
