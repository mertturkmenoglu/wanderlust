package categories

import "wanderlust/internal/pkg/db"

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

func mapCreateCategoryResponseToDto(v db.Category) CreateCategoryResponseDto {
	return CreateCategoryResponseDto{
		ID:    int32(v.ID),
		Name:  v.Name,
		Image: v.Image,
	}
}

func mapUpdateCategoryResponseToDto(v db.Category) UpdateCategoryResponseDto {
	return UpdateCategoryResponseDto{
		ID:    int32(v.ID),
		Name:  v.Name,
		Image: v.Image,
	}
}
