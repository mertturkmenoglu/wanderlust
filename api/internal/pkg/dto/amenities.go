package dto

type Amenity struct {
	ID   int32  `json:"id" example:"15" doc:"ID of the amenity"`
	Name string `json:"name" example:"Delivery Service" doc:"Name of the amenity"`
}

type ListAmenitiesOutput struct {
	Body ListAmenitiesOutputBody
}

type ListAmenitiesOutputBody struct {
	Amenities []Amenity `json:"amenities"`
}

type CreateAmenityInput struct {
	Body CreateAmenityInputBody
}

type CreateAmenityInputBody struct {
	Name string `json:"name" required:"true" minLength:"1" maxLength:"64" example:"Delivery Service" doc:"Name of the amenity"`
}

type CreateAmenityOutput struct {
	Body CreateAmenityOutputBody
}

type CreateAmenityOutputBody struct {
	Amenity
}

type UpdateAmenityInput struct {
	ID   int32 `path:"id" required:"true" example:"15" doc:"ID of the amenity"`
	Body UpdateAmenityInputBody
}

type UpdateAmenityInputBody struct {
	CreateAmenityInputBody
}

type UpdateAmenityOutput struct {
	Body UpdateAmenityOutputBody
}

type UpdateAmenityOutputBody struct {
	Amenity
}

type DeleteAmenityInput struct {
	ID int32 `path:"id" required:"true" example:"15" doc:"ID of the amenity"`
}
