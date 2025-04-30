package dto

type Category struct {
	ID    int16  `json:"id" example:"4" doc:"ID of the category"`
	Name  string `json:"name" example:"Natural landmarks" doc:"Name of the category"`
	Image string `json:"image" example:"https://example.com/image.jpg" doc:"Image URL"`
}

type ListCategoriesOutput struct {
	Body ListCategoriesOutputBody
}

type ListCategoriesOutputBody struct {
	Categories []Category `json:"categories"`
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
	Category
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
	Category
}

type DeleteCategoryInput struct {
	ID int16 `path:"id" required:"true" example:"4" doc:"ID of the category"`
}
