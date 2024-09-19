package categories

import "wanderlust/internal/db"

func mapGetCategoriesToDto(v []db.Category) GetCategoriesResponseDto {
	var categories []GetCategoryByIdResponseDto

	for _, category := range v {
		categories = append(categories, mapGetCategoryByIdRowToDto(category))
	}

	return GetCategoriesResponseDto{
		Categories: categories,
	}
}

func mapGetCategoryByIdRowToDto(v db.Category) GetCategoryByIdResponseDto {
	return GetCategoryByIdResponseDto{
		ID:    int32(v.ID),
		Name:  v.Name,
		Image: v.Image,
	}
}
