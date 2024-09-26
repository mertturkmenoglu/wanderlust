package amenities

type GetAmenitiesResponseDto struct {
	Amenities []GetAmenityByIdResponseDto `json:"amenities"`
}
type GetAmenityByIdResponseDto struct {
	ID   int32  `json:"id"`
	Name string `json:"name"`
}

type UpdateAmenityRequestDto struct {
	Name string `json:"name" validate:"required,min=1,max=64"`
}