package categories

import "wanderlust/pkg/dto"

type ListCategoriesInput struct {
}

type ListCategoriesOutput struct {
	Body ListCategoriesOutputBody
}

type ListCategoriesOutputBody struct {
	Categories []dto.Category `json:"categories" required:"true" nullable:"false"`
}

type CreateCategoryInput struct {
	Body CreateCategoryInputBody
}

type CreateCategoryInputBody struct {
	ID int16 `json:"id" required:"true" minimum:"1" example:"4" doc:"ID of the category"`
	UpdateCategoryInputBody
}

type CreateCategoryOutput struct {
	Body CreateCategoryOutputBody
}

type CreateCategoryOutputBody struct {
	Category dto.Category `json:"category" required:"true" nullable:"false"`
}

type UpdateCategoryInput struct {
	ID   int16 `path:"id" required:"true" example:"4" doc:"ID of the category"`
	Body UpdateCategoryInputBody
}

type UpdateCategoryInputBody struct {
	Name  string `json:"name" required:"true" minLength:"1" maxLength:"64" example:"Natural landmarks" doc:"Name of the category"`
	Image string `json:"image" required:"true" minLength:"1" maxLength:"255" format:"uri" example:"https://example.com/image.jpg" doc:"Image URL"`
}

type UpdateCategoryOutput struct {
	Body UpdateCategoryOutputBody
}

type UpdateCategoryOutputBody struct {
	Category dto.Category `json:"category" required:"true" nullable:"false"`
}

type DeleteCategoryInput struct {
	ID int16 `path:"id" required:"true" example:"4" doc:"ID of the category"`
}

type DeleteCategoryOutput struct {
}
