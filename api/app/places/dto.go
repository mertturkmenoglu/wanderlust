package places

import "wanderlust/pkg/dto"

type GetPlaceByIdInput struct {
	ID string `path:"id" validate:"required" doc:"ID of place" example:"7323488942953598976"`
}

type GetPlaceByIdOutput struct {
	Body GetPlaceByIdOutputBody
}

type GetPlaceByIdOutputBody struct {
	Place dto.Place        `json:"place"`
	Meta  GetPlaceByIdMeta `json:"meta"`
}

type GetPlaceByIdMeta struct {
	IsFavorite   bool `json:"isFavorite"`
	IsBookmarked bool `json:"isBookmarked"`
}

type PeekPlacesInput struct {
}

type PeekPlacesOutput struct {
	Body PeekPlacesOutputBody
}

type PeekPlacesOutputBody struct {
	Places []dto.Place `json:"places"`
}

type UpdatePlaceInfoInput struct {
	ID   string `path:"id" validate:"required" doc:"ID of Place" example:"7323488942953598976"`
	Body UpdatePlaceInfoInputBody
}

type UpdatePlaceInfoInputBody struct {
	Name               string  `json:"name" example:"The Great Wall of China" doc:"Name of place"`
	CategoryID         int16   `json:"categoryId" example:"1" doc:"ID of category"`
	Description        string  `json:"description" example:"The Great Wall of China is a series of fortifications." doc:"Description of the place"`
	Phone              *string `json:"phone" example:"+989123456789" doc:"Phone number"`
	Website            *string `json:"website" example:"https://example.com" doc:"Website"`
	AccessibilityLevel int16   `json:"accessibilityLevel" example:"2" doc:"Accessibility level"`
	PriceLevel         int16   `json:"priceLevel" example:"2" doc:"Price level"`
}

type UpdatePlaceInfoOutput struct {
	Body UpdatePlaceInfoOutputBody
}

type UpdatePlaceInfoOutputBody struct {
	Place dto.Place `json:"place"`
}

type UpdatePlaceAddressInput struct {
	ID   string `path:"id" validate:"required" doc:"ID of the place" example:"7323488942953598976"`
	Body UpdatePlaceAddressInputBody
}

type UpdatePlaceAddressInputBody struct {
	CityID     int32   `json:"cityId" example:"1234" doc:"ID of city"`
	Line1      string  `json:"line1" example:"Example Street" doc:"Line 1"`
	Line2      *string `json:"line2" example:"Example Street" doc:"Line 2"`
	PostalCode *string `json:"postalCode" example:"12345" doc:"Postal code"`
	Lat        float64 `json:"lat" example:"12.3456" doc:"Latitude"`
	Lng        float64 `json:"lng" example:"12.3456" doc:"Longitude"`
}

type UpdatePlaceAddressOutput struct {
	Body UpdatePlaceAddressOutputBody
}

type UpdatePlaceAddressOutputBody struct {
	Place dto.Place `json:"place"`
}

type UpdatePlaceAmenitiesInput struct {
	ID   string `path:"id" validate:"required" doc:"ID of the place" example:"7323488942953598976"`
	Body UpdatePlaceAmenitiesInputBody
}

type UpdatePlaceAmenitiesInputBody struct {
	Amenities map[string]*string `json:"amenities" doc:"Amenities of the place"`
}

type UpdatePlaceAmenitiesOutput struct {
	Body UpdatePlaceAmenitiesOutputBody
}

type UpdatePlaceAmenitiesOutputBody struct {
	Place dto.Place `json:"place"`
}

type UpdatePlaceHoursInput struct {
	ID   string `path:"id" validate:"required" doc:"ID of Place" example:"7323488942953598976"`
	Body UpdatePlaceHoursInputBody
}

type UpdatePlaceHoursInputBody struct {
	Hours map[string]*string `json:"hours" doc:"Hours of the place"`
}

type UpdatePlaceHoursOutput struct {
	Body UpdatePlaceHoursOutputBody
}

type UpdatePlaceHoursOutputBody struct {
	Place dto.Place `json:"place"`
}
