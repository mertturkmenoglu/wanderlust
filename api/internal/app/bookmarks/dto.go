package bookmarks

import "time"

type CreateBookmarkRequestDto struct {
	PoiId string `json:"poiId" validate:"required,min=1"`
}

type CreateBookmarkResponseDto struct {
	ID        int32     `json:"id"`
	PoiID     string    `json:"poiId"`
	UserID    string    `json:"userId"`
	CreatedAt time.Time `json:"createdAt"`
}

type GetUserBookmarksResponseDto struct {
	Bookmarks []GetBookmarkByIdResponseDto `json:"bookmarks"`
}

type GetBookmarkByIdResponseDto struct {
	ID        int32       `json:"id"`
	PoiID     string      `json:"poiId"`
	Poi       BookmarkPoi `json:"poi"`
	UserID    string      `json:"userId"`
	CreatedAt time.Time   `json:"createdAt"`
}

type BookmarkPoi struct {
	ID         string              `json:"id"`
	Name       string              `json:"name"`
	AddressID  int32               `json:"addressId"`
	Address    BookmarkPoiAddress  `json:"address"`
	CategoryID int16               `json:"categoryId"`
	Category   BookmarkPoiCategory `json:"category"`
	FirstMedia BookmarkPoiMedia    `json:"media"`
}

type BookmarkPoiAddress struct {
	ID         int32           `json:"id"`
	CityID     int32           `json:"cityId"`
	City       BookmarkPoiCity `json:"city"`
	Line1      string          `json:"line1"`
	Line2      *string         `json:"line2"`
	PostalCode *string         `json:"postalCode"`
	Lat        float64         `json:"lat"`
	Lng        float64         `json:"lng"`
}

type BookmarkPoiCity struct {
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

type BookmarkPoiCategory struct {
	ID    int16  `json:"id"`
	Name  string `json:"name"`
	Image string `json:"image"`
}

type BookmarkPoiMedia struct {
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
