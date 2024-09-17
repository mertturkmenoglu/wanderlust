package cities

// GetCityByIdResponseDto godoc
//
// @Description Get city by id response dto
type GetCityByIdResponseDto struct {
	ID         int32   `json:"id" example:"528696135489945615" validate:"required"`
	Name       string  `json:"name" example:"London" validate:"required"`
	State      State   `json:"state" validate:"required"`
	Country    Country `json:"country" validate:"required"`
	Latitude   float64 `json:"latitude" example:"51.5073509" validate:"required"`
	Longitude  float64 `json:"longitude" example:"-0.1277583" validate:"required"`
	WikiDataID string  `json:"wikiDataId" example:"Q145" validate:"required"`
} //@name CitiesGetCityByIdResponseDto

// State godoc
//
// @Description Get city by id state dto
type State struct {
	ID        int32   `json:"id" example:"528696135489945615" validate:"required"`
	Name      string  `json:"name" example:"London" validate:"required"`
	StateCode string  `json:"stateCode" example:"GB" validate:"required"`
	Type      *string `json:"type" example:"state" validate:"required"`
	Latitude  float64 `json:"latitude" example:"51.5073509" validate:"required"`
	Longitude float64 `json:"longitude" example:"-0.1277583" validate:"required"`
} //@name CitiesState

// Country godoc
//
// @Description Get city by id country dto
type Country struct {
	ID             int32   `json:"id" example:"528696135489945615" validate:"required"`
	Name           string  `json:"name" example:"United Kingdom" validate:"required"`
	Iso2           string  `json:"iso2" example:"GB" validate:"required"`
	NumericCode    string  `json:"numericCode" example:"826" validate:"required"`
	PhoneCode      string  `json:"phoneCode" example:"44" validate:"required"`
	Capital        string  `json:"capital" example:"London" validate:"required"`
	Currency       string  `json:"currency" example:"GBP" validate:"required"`
	CurrencyName   string  `json:"currencyName" example:"British Pound" validate:"required"`
	CurrencySymbol string  `json:"currencySymbol" example:"£" validate:"required"`
	Tld            string  `json:"tld" example:"uk" validate:"required"`
	Native         string  `json:"native" example:"United Kingdom" validate:"required"`
	Region         string  `json:"region" example:"Europe" validate:"required"`
	Subregion      string  `json:"subregion" example:"Northern Europe" validate:"required"`
	Timezones      string  `json:"timezones" example:"Europe/London" validate:"required"`
	Latitude       float64 `json:"latitude" example:"51.5073509" validate:"required"`
	Longitude      float64 `json:"longitude" example:"-0.1277583" validate:"required"`
} //@name CitiesCountry
