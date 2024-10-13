package health

type GetHealthResponseDto struct {
	Message string `json:"message" validate:"required"`
}
