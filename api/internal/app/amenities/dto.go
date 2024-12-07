package amenities

type ListAmenitiesDto struct {
	Amenities []AmenityDto `json:"amenities"`
}

type AmenityDto struct {
	ID   int32  `json:"id"`
	Name string `json:"name"`
}

type UpdateReqDto struct {
	Name string `json:"name" validate:"required,min=1,max=64"`
}

type CreateReqDto struct {
	Name string `json:"name" validate:"required,min=1,max=64"`
}

type CreateAmenityResDto = AmenityDto
