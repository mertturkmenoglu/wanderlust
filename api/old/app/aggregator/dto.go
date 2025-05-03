package aggregator

import "time"

type HomeAggregatorResponseDto struct {
	New       []HomeAggregatorPoi `json:"new"`
	Popular   []HomeAggregatorPoi `json:"popular"`
	Featured  []HomeAggregatorPoi `json:"featured"`
	Favorites []HomeAggregatorPoi `json:"favorites"`
}

type HomeAggregatorPoi struct {
	ID         string                    `json:"id"`
	Name       string                    `json:"name"`
	AddressID  int32                     `json:"addressId"`
	Address    HomeAggregatorPoiAddress  `json:"address"`
	CategoryID int16                     `json:"categoryId"`
	Category   HomeAggregatorPoiCategory `json:"category"`
	FirstMedia HomeAggregatorPoiMedia    `json:"media"`
}

type HomeAggregatorPoiAddress struct {
	ID         int32                 `json:"id"`
	CityID     int32                 `json:"cityId"`
	City       HomeAggregatorPoiCity `json:"city"`
	Line1      string                `json:"line1"`
	Line2      *string               `json:"line2"`
	PostalCode *string               `json:"postalCode"`
	Lat        float64               `json:"lat"`
	Lng        float64               `json:"lng"`
}

type HomeAggregatorPoiCity struct {
	ID          int32   `json:"id"`
	Name        string  `json:"name"`
	StateCode   string  `json:"stateCode"`
	StateName   string  `json:"stateName"`
	CountryCode string  `json:"countryCode"`
	CountryName string  `json:"countryName"`
	ImageUrl    string  `json:"imageUrl"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	Description string  `json:"description"`
}

type HomeAggregatorPoiCategory struct {
	ID    int16  `json:"id"`
	Name  string `json:"name"`
	Image string `json:"image"`
}

type HomeAggregatorPoiMedia struct {
	ID         int64     `json:"id"`
	PoiID      string    `json:"poiId"`
	Url        string    `json:"url"`
	Thumbnail  string    `json:"thumbnail"`
	Alt        string    `json:"alt"`
	Caption    *string   `json:"caption"`
	Width      int32     `json:"width"`
	Height     int32     `json:"height"`
	MediaOrder int16     `json:"mediaOrder"`
	Extension  string    `json:"extension"`
	MimeType   string    `json:"mimeType"`
	FileSize   int64     `json:"fileSize"`
	CreatedAt  time.Time `json:"createdAt"`
}
