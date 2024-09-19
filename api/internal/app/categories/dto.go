package categories

// GetCategoriesResponseDto godoc
//
// @Description Get categories response dto
type GetCategoriesResponseDto struct {
	Categories []GetCategoryByIdResponseDto `json:"categories" validate:"required"`
} //@name CategoriesGetCategoriesResponseDto

// GetCategoryByIdResponseDto godoc
//
// @Description Get category by id response dto
type GetCategoryByIdResponseDto struct {
	ID    int32  `json:"id" example:"10" validate:"required"`
	Name  string `json:"name" example:"Photography Spots" validate:"required"`
	Image string `json:"image" example:"https://example.com/foo.png" validate:"required"`
} //@name CategoriesGetCategoryByIdResponseDto
