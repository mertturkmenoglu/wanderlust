package pois

import "time"

// OpenTimes godoc
//
// @Description Open times
type OpenTimes struct {
	Day    string  `json:"day" validate:"required"`
	Open   *string `json:"open"`
	Close  *string `json:"close"`
	Closed bool    `json:"closed" validate:"required"`
} //@name PoisOpenTimes

// PeekPoisResponseDto godoc
//
// @Description Peek pois response dto
type PeekPoisResponseDto struct {
	Pois []PeekPoisItemDto `json:"pois" validate:"required"`
} //@name PoisPeekPoisResponseDto

// PeekPoiItemDto godoc
//
// @Description Peek pois item dto
type PeekPoisItemDto struct {
	ID                 string      `json:"id" example:"528696135489945615" validate:"required"`
	Name               string      `json:"name" example:"Empire State Building" validate:"required"`
	Phone              *string     `json:"phone" example:"+1234567890"`
	Description        string      `json:"description" example:"This is a description" validate:"required"`
	AddressID          int32       `json:"addressId" example:"42" validate:"required"`
	Website            *string     `json:"website" example:"https://example.com"`
	PriceLevel         int16       `json:"priceLevel" example:"2" validate:"required"`
	AccessibilityLevel int16       `json:"accessibilityLevel" example:"3" validate:"required"`
	TotalVotes         int32       `json:"totalVotes" example:"100" validate:"required"`
	TotalPoints        int32       `json:"totalPoints" example:"100" validate:"required"`
	TotalFavorites     int32       `json:"totalFavorites" example:"100" validate:"required"`
	CategoryID         int16       `json:"categoryId" example:"10" validate:"required"`
	OpenTimes          []OpenTimes `json:"openTimes" validate:"required"`
	CreatedAt          time.Time   `json:"createdAt" example:"2024-08-26T10:24:13.508676+03:00" format:"date-time" validate:"required"`
	UpdatedAt          time.Time   `json:"updatedAt" example:"2024-08-26T10:24:13.508676+03:00" format:"date-time" validate:"required"`
} //@name PoisPeekPoisItemDto

type GetPoiByIdResponseDto struct {
	ID                 string      `json:"id" example:"528696135489945615" validate:"required"`
	Name               string      `json:"name" example:"Empire State Building" validate:"required"`
	Phone              *string     `json:"phone" example:"+1234567890"`
	Description        string      `json:"description" example:"This is a description" validate:"required"`
	AddressID          int32       `json:"addressId" example:"42" validate:"required"`
	Website            *string     `json:"website" example:"https://example.com"`
	PriceLevel         int16       `json:"priceLevel" example:"2" validate:"required"`
	AccessibilityLevel int16       `json:"accessibilityLevel" example:"3" validate:"required"`
	TotalVotes         int32       `json:"totalVotes" example:"100" validate:"required"`
	TotalPoints        int32       `json:"totalPoints" example:"100" validate:"required"`
	TotalFavorites     int32       `json:"totalFavorites" example:"100" validate:"required"`
	CategoryID         int16       `json:"categoryId" example:"10" validate:"required"`
	Category           Category    `json:"category" validate:"required"`
	Amenities          []Amenity   `json:"amenities" validate:"required"`
	OpenTimes          []OpenTimes `json:"openTimes" validate:"required"`
	Media              []Media     `json:"media" validate:"required"`
	Address            Address     `json:"address" validate:"required"`
	CreatedAt          time.Time   `json:"createdAt" example:"2024-08-26T10:24:13.508676+03:00" format:"date-time" validate:"required"`
	UpdatedAt          time.Time   `json:"updatedAt" example:"2024-08-26T10:24:13.508676+03:00" format:"date-time" validate:"required"`
}

type Category struct {
	ID    int16  `json:"id" example:"10" validate:"required"`
	Name  string `json:"name" example:"Photography Spots" validate:"required"`
	Image string `json:"image" example:"https://example.com/foo.png" validate:"required"`
}

type Media struct {
	ID         int64     `json:"id" example:"528696135489945615" validate:"required"`
	PoiID      string    `json:"poiId" example:"528696135489945615" validate:"required"`
	Url        string    `json:"url" example:"https://example.com/image.jpg" validate:"required"`
	Thumbnail  string    `json:"thumbnail" example:"https://example.com/image.jpg" validate:"required"`
	Alt        string    `json:"alt" example:"A photo of a person" validate:"required"`
	Caption    *string   `json:"caption" example:"A photo of a person"`
	Width      int32     `json:"width" example:"512" validate:"required"`
	Height     int32     `json:"height" example:"512" validate:"required"`
	MediaOrder int16     `json:"mediaOrder" example:"1" validate:"required"`
	Extension  string    `json:"extension" example:"jpg" validate:"required"`
	MimeType   string    `json:"mimeType" example:"image/jpeg" validate:"required"`
	FileSize   int64     `json:"fileSize" example:"1024" validate:"required"`
	CreatedAt  time.Time `json:"createdAt" example:"2024-08-26T10:24:13.508676+03:00" format:"date-time" validate:"required"`
}

type Amenity struct {
	ID   int32  `json:"id" example:"10" validate:"required"`
	Name string `json:"name" example:"Photography Spots" validate:"required"`
}

type Address struct {
	ID         int32   `json:"id" example:"42" validate:"required"`
	CityID     int32   `json:"cityId" example:"42" validate:"required"`
	City       City    `json:"city" validate:"required"`
	Line1      string  `json:"line1" example:"123 Main St" validate:"required"`
	Line2      *string `json:"line2" example:"Apt 1"`
	PostalCode *string `json:"postalCode" example:"12345"`
	Lat        float64 `json:"lat" example:"51.5073509" validate:"required"`
	Lng        float64 `json:"lng" example:"-0.1277583" validate:"required"`
}

type City struct {
	ID          int32   `json:"id" example:"42" validate:"required"`
	Name        string  `json:"name" example:"New York City" validate:"required"`
	StateCode   string  `json:"stateCode" example:"NY" validate:"required"`
	StateName   string  `json:"stateName" example:"New York" validate:"required"`
	CountryCode string  `json:"countryCode" example:"US" validate:"required"`
	CountryName string  `json:"countryName" example:"United States" validate:"required"`
	ImageUrl    string  `json:"imageUrl" example:"https://example.com/foo.png" validate:"required"`
	Latitude    float64 `json:"latitude" example:"51.5073509" validate:"required"`
	Longitude   float64 `json:"longitude" example:"-0.1277583" validate:"required"`
	Description string  `json:"description" example:"New York City is the most populous city in the United States." validate:"required"`
}
