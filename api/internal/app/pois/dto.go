package pois

import "time"

type OpenTimes struct {
	Day    string  `json:"day"`
	Open   *string `json:"open"`
	Close  *string `json:"close"`
	Closed bool    `json:"closed"`
}

type PeekPoisResponseDto struct {
	Pois []PeekPoisItemDto `json:"pois"`
}

type PeekPoisItemDto struct {
	ID                 string      `json:"id"`
	Name               string      `json:"name"`
	Phone              *string     `json:"phone"`
	Description        string      `json:"description"`
	AddressID          int32       `json:"addressId"`
	Website            *string     `json:"website"`
	PriceLevel         int16       `json:"priceLevel"`
	AccessibilityLevel int16       `json:"accessibilityLevel"`
	TotalVotes         int32       `json:"totalVotes"`
	TotalPoints        int32       `json:"totalPoints"`
	TotalFavorites     int32       `json:"totalFavorites"`
	CategoryID         int16       `json:"categoryId"`
	OpenTimes          []OpenTimes `json:"openTimes"`
	CreatedAt          time.Time   `json:"createdAt"`
	UpdatedAt          time.Time   `json:"updatedAt"`
}

type GetPoiByIdResponseDto struct {
	ID                 string      `json:"id"`
	Name               string      `json:"name"`
	Phone              *string     `json:"phone"`
	Description        string      `json:"description"`
	AddressID          int32       `json:"addressId"`
	Website            *string     `json:"website"`
	PriceLevel         int16       `json:"priceLevel"`
	AccessibilityLevel int16       `json:"accessibilityLevel"`
	TotalVotes         int32       `json:"totalVotes"`
	TotalPoints        int32       `json:"totalPoints"`
	TotalFavorites     int32       `json:"totalFavorites"`
	CategoryID         int16       `json:"categoryId"`
	Category           Category    `json:"category"`
	Amenities          []Amenity   `json:"amenities"`
	OpenTimes          []OpenTimes `json:"openTimes"`
	Media              []Media     `json:"media"`
	Address            Address     `json:"address"`
	CreatedAt          time.Time   `json:"createdAt"`
	UpdatedAt          time.Time   `json:"updatedAt"`
}

type Category struct {
	ID    int16  `json:"id"`
	Name  string `json:"name"`
	Image string `json:"image"`
}

type Media struct {
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

type Amenity struct {
	ID   int32  `json:"id"`
	Name string `json:"name"`
}

type Address struct {
	ID         int32   `json:"id"`
	CityID     int32   `json:"cityId"`
	City       City    `json:"city"`
	Line1      string  `json:"line1"`
	Line2      *string `json:"line2"`
	PostalCode *string `json:"postalCode"`
	Lat        float64 `json:"lat"`
	Lng        float64 `json:"lng"`
}

type City struct {
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
