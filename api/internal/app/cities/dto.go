package cities

type GetCityByIdResponseDto struct {
	ID                   int32   `json:"id"`
	Name                 string  `json:"name"`
	StateCode            string  `json:"stateCode"`
	StateName            string  `json:"stateName"`
	CountryCode          string  `json:"countryCode"`
	CountryName          string  `json:"countryName"`
	ImageUrl             string  `json:"imageUrl"`
	Latitude             float64 `json:"latitude"`
	Longitude            float64 `json:"longitude"`
	Description          string  `json:"description"`
	ImageLicense         *string `json:"imageLicense"`
	ImageLicenseLink     *string `json:"imageLicenseLink"`
	ImageAttribution     *string `json:"imageAttribute"`
	ImageAttributionLink *string `json:"imageAttributionLink"`
}

type GetCitiesResponseDto struct {
	Cities []GetCityByIdResponseDto `json:"cities"`
}

type GetFeaturedCitiesResponseDto struct {
	Cities []GetCityByIdResponseDto `json:"cities"`
}

type CreateCityRequestDto struct {
	ID                   int32   `json:"id" validate:"required,min=1"`
	Name                 string  `json:"name" validate:"required,min=1,max=64"`
	StateCode            string  `json:"stateCode" validate:"required,min=1,max=16"`
	StateName            string  `json:"stateName" validate:"required,min=1,max=64"`
	CountryCode          string  `json:"countryCode" validate:"required,len=2"`
	CountryName          string  `json:"countryName" validate:"required,min=1,max=64"`
	ImageUrl             string  `json:"imageUrl" validate:"required,min=1,max=256"`
	Latitude             float64 `json:"latitude" validate:"required,min=-90,max=90"`
	Longitude            float64 `json:"longitude" validate:"required,min=-180,max=180"`
	Description          string  `json:"description" validate:"required,min=1,max=1024"`
	ImageLicense         string  `json:"imageLicense" validate:"required,min=1,max=32"`
	ImageLicenseLink     string  `json:"imageLicenseLink" validate:"required,min=1,max=256"`
	ImageAttribution     string  `json:"imageAttribute" validate:"required,min=1,max=256"`
	ImageAttributionLink string  `json:"imageAttributionLink" validate:"required,min=1,max=256"`
}

type CreateCityResponseDto = GetCityByIdResponseDto

type UpdateCityRequestDto struct {
	Name                 string  `json:"name" validate:"required,min=1,max=64"`
	StateCode            string  `json:"stateCode" validate:"required,min=1,max=16"`
	StateName            string  `json:"stateName" validate:"required,min=1,max=64"`
	CountryCode          string  `json:"countryCode" validate:"required,len=2"`
	CountryName          string  `json:"countryName" validate:"required,min=1,max=64"`
	ImageUrl             string  `json:"imageUrl" validate:"required,min=1,max=256"`
	Latitude             float64 `json:"latitude" validate:"required,min=-90,max=90"`
	Longitude            float64 `json:"longitude" validate:"required,min=-180,max=180"`
	Description          string  `json:"description" validate:"required,min=1,max=1024"`
	ImageLicense         *string `json:"imageLicense" validate:"required,min=1,max=32"`
	ImageLicenseLink     *string `json:"imageLicenseLink" validate:"required,min=1,max=256"`
	ImageAttribution     *string `json:"imageAttribute" validate:"required,min=1,max=256"`
	ImageAttributionLink *string `json:"imageAttributionLink" validate:"required,min=1,max=256"`
}

type UpdateCityResponseDto = GetCityByIdResponseDto
