package cities

// GetCityByIdResponseDto godoc
//
// @Description Get city by id response dto
type GetCityByIdResponseDto struct {
	ID          int32   `json:"id" example:"24601" validate:"required"`
	Name        string  `json:"name" example:"New York City" validate:"required"`
	StateCode   string  `json:"stateCode" example:"NY" validate:"required"`
	StateName   string  `json:"stateName" example:"New York" validate:"required"`
	CountryCode string  `json:"countryCode" example:"US" validate:"required"`
	CountryName string  `json:"countryName" example:"United States" validate:"required"`
	ImageUrl    string  `json:"imageUrl" example:"https://example.com/foo.png" validate:"required"`
	Latitude    float64 `json:"latitude" example:"51.5073509" validate:"required"`
	Longitude   float64 `json:"longitude" example:"-0.1277583" validate:"required"`
	Description string  `json:"description" example:"New York City is the most populous city in the United States." validate:"required"`
} //@name CitiesGetCityByIdResponseDto

// GetCitiesResponseDto godoc
//
// @Description Get cities response dto
type GetCitiesResponseDto struct {
	Cities []GetCityByIdResponseDto `json:"cities" validate:"required"`
}

// GetFeaturedCitiesResponseDto godoc
//
// @Description Get featured cities response dto
type GetFeaturedCitiesResponseDto struct {
	Cities []GetCityByIdResponseDto `json:"cities" validate:"required"`
}
