package categories

type GetCategoriesResponseDto struct {
	Categories []GetCategoryByIdResponseDto `json:"categories"`
}

type GetCategoryByIdResponseDto struct {
	ID    int32  `json:"id"`
	Name  string `json:"name"`
	Image string `json:"image"`
}

type CreateCategoryRequestDto struct {
	ID    int16  `json:"id" validate:"required,min=1"`
	Name  string `json:"name" validate:"required,min=1,max=64"`
	Image string `json:"image" validate:"required,url"`
}

type CreateCategoryResponseDto = GetCategoryByIdResponseDto

type UpdateCategoryRequestDto struct {
	Name  string `json:"name" validate:"required,min=1,max=64"`
	Image string `json:"image" validate:"required,url"`
}

type UpdateCategoryResponseDto = GetCategoryByIdResponseDto
