package dto

type City struct {
	ID          int32           `json:"id" example:"8102" doc:"City ID"`
	Name        string          `json:"name" example:"New York" doc:"City name"`
	Description string          `json:"description" example:"A big metropolis." doc:"City description"`
	State       CityState       `json:"state"`
	Country     CityCountry     `json:"country"`
	Coordinates CityCoordinates `json:"coordinates" `
	Image       string          `json:"image"`
}

type CityState struct {
	Code string `json:"code" example:"NY" doc:"State code"`
	Name string `json:"name" example:"New York" doc:"State name"`
}

type CityCountry struct {
	Code string `json:"code" example:"US" doc:"Country code"`
	Name string `json:"name" example:"United States" doc:"Country name"`
}

type CityCoordinates struct {
	Latitude  float64 `json:"latitude" example:"40.7128" doc:"Latitude"`
	Longitude float64 `json:"longitude" example:"-74.0060" doc:"Longitude"`
}

type CitiesListOutput struct {
	Body CitiesListOutputBody
}

type CitiesListOutputBody struct {
	Cities []City `json:"cities"`
}

type CitiesFeaturedOutput struct {
	Body CitiesFeaturedOutputBody
}

type CitiesFeaturedOutputBody struct {
	Cities []City `json:"cities"`
}

type GetCityByIdInput struct {
	ID int32 `path:"id" required:"true" example:"8102" doc:"City ID"`
}

type GetCityByIdOutput struct {
	Body GetCityByIdOutputBody
}

type GetCityByIdOutputBody struct {
	City
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
	City
}

type DeleteCityInput struct {
	ID int32 `path:"id" required:"true" example:"8102" doc:"City ID"`
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
	Latitude    float64 `json:"latitude" required:"true" min:"-90" max:"90" example:"40.7128" doc:"Latitude"`
	Longitude   float64 `json:"longitude" required:"true" min:"-180" max:"180" example:"-74.0060" doc:"Longitude"`
	Description string  `json:"description" required:"true" minLength:"1" maxLength:"1024" example:"A big metropolis." doc:"City description"`
}

type UpdateCityOutput struct {
	Body UpdateCityOutputBody
}

type UpdateCityOutputBody struct {
	City
}
