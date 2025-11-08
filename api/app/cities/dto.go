package cities

import "wanderlust/pkg/dto"

type ListCitiesInput struct {
}

type ListCitiesOutput struct {
	Body ListCitiesOutputBody
}

type ListCitiesOutputBody struct {
	Cities []dto.City `json:"cities"`
}

type ListFeaturedCitiesInput struct {
}

type ListFeaturedCitiesOutput struct {
	Body ListFeaturedCitiesOutputBody
}

type ListFeaturedCitiesOutputBody struct {
	Cities []dto.City `json:"cities"`
}

type GetCityByIdInput struct {
	ID int32 `path:"id" required:"true" example:"8102" doc:"City ID"`
}

type GetCityByIdOutput struct {
	Body GetCityByIdOutputBody
}

type GetCityByIdOutputBody struct {
	City dto.City `json:"city"`
}

type CreateCityInput struct {
	Body CreateCityInputBody
}

type CreateCityInputBody struct {
	ID int32 `json:"id" required:"true" minimum:"1" example:"8102" doc:"City ID"`
	UpdateCityInputBody
}

type CreateCityOutput struct {
	Body CreateCityOutputBody
}

type CreateCityOutputBody struct {
	City dto.City `json:"city"`
}

type DeleteCityInput struct {
	ID int32 `path:"id" required:"true" example:"8102" doc:"City ID"`
}

type DeleteCityOutput struct {
}

type UpdateCityInput struct {
	ID   int32 `path:"id" required:"true" example:"8102" doc:"City ID"`
	Body UpdateCityInputBody
}

type UpdateCityInputBody struct {
	Name        string  `json:"name" required:"true" minLength:"1" maxLength:"64" example:"New York" doc:"City name"`
	StateCode   string  `json:"stateCode" required:"true" minLength:"1" maxLength:"16" example:"NY" doc:"State code"`
	StateName   string  `json:"stateName" required:"true" minLength:"1" maxLength:"64" example:"New York" doc:"State name"`
	CountryCode string  `json:"countryCode" required:"true" minLength:"2" maxLength:"2" example:"US" doc:"Country code"`
	CountryName string  `json:"countryName" required:"true" minLength:"1" maxLength:"64" example:"United States" doc:"Country name"`
	Image       string  `json:"image" required:"true" minLength:"1" maxLength:"256" format:"uri" example:"https://example.com/image.jpg" doc:"Image URL"`
	Lat         float64 `json:"lat" required:"true" min:"-90" max:"90" example:"40.7128" doc:"Latitude"`
	Lng         float64 `json:"lng" required:"true" min:"-180" max:"180" example:"-74.0060" doc:"Longitude"`
	Description string  `json:"description" required:"true" minLength:"1" maxLength:"1024" example:"A big metropolis." doc:"City description"`
}

type UpdateCityOutput struct {
	Body UpdateCityOutputBody
}

type UpdateCityOutputBody struct {
	City dto.City `json:"city"`
}
