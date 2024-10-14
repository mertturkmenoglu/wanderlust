package lists

import (
	"time"
)

type GetAllListsOfUserDto struct {
	Lists []ListDto `json:"lists"`
}

type GetPublicListsOfUserDto struct {
	Lists []ListDto `json:"lists"`
}

type ListDto struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	UserID    string    `json:"userId"`
	IsPublic  bool      `json:"isPublic"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type CreateListRequestDto struct {
	Name     string `json:"name" validate:"required,min=1,max=128"`
	IsPublic bool   `json:"isPublic" validate:"boolean"`
}

type UpdateListRequestDto struct {
	Name     string `json:"name" validate:"required,min=1,max=128"`
	IsPublic bool   `json:"isPublic" validate:"boolean"`
}

type CreateListResponseDto struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	UserID    string    `json:"userId"`
	IsPublic  bool      `json:"isPublic"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type GetListByIdResponseDto struct {
	ID        string        `json:"id"`
	Name      string        `json:"name"`
	UserID    string        `json:"userId"`
	User      ListUserDto   `json:"user"`
	IsPublic  bool          `json:"isPublic"`
	CreatedAt time.Time     `json:"createdAt"`
	UpdatedAt time.Time     `json:"updatedAt"`
	Items     []ListItemDto `json:"items"`
}

type ListUserDto struct {
	ID           string  `json:"id"`
	Username     string  `json:"username"`
	FullName     string  `json:"fullName"`
	ProfileImage *string `json:"profileImage"`
}

type ListItemDto struct {
	ListID    string         `json:"listId"`
	PoiID     string         `json:"poiId"`
	Poi       ListItemPoiDto `json:"poi"`
	ListIndex int32          `json:"listIndex"`
	CreatedAt time.Time      `json:"createdAt"`
}

type ListItemPoiDto struct {
	ID          string                 `json:"id"`
	Name        string                 `json:"name"`
	Description string                 `json:"description"`
	AddressID   int32                  `json:"addressId"`
	CategoryID  int16                  `json:"categoryId"`
	CreatedAt   time.Time              `json:"createdAt"`
	UpdatedAt   time.Time              `json:"updatedAt"`
	Address     ListItemPoiAddressDto  `json:"address"`
	Category    ListItemPoiCategoryDto `json:"category"`
	FirstMedia  ListItemPoiMedia       `json:"firstMedia"`
}

type ListItemPoiMedia struct {
	ID         int64     `json:"id"`
	PoiID      string    `json:"poiId"`
	Url        string    `json:"url"`
	Alt        string    `json:"alt"`
	Caption    *string   `json:"caption"`
	MediaOrder int16     `json:"mediaOrder"`
	CreatedAt  time.Time `json:"createdAt"`
}

type ListItemPoiAddressDto struct {
	ID         int32                     `json:"id"`
	CityID     int32                     `json:"cityId"`
	City       ListItemPoiAddressCityDto `json:"city"`
	Line1      string                    `json:"line1"`
	Line2      *string                   `json:"line2"`
	PostalCode *string                   `json:"postalCode"`
	Lat        float64                   `json:"lat"`
	Lng        float64                   `json:"lng"`
}

type ListItemPoiAddressCityDto struct {
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

type ListItemPoiCategoryDto struct {
	ID    int16  `json:"id"`
	Name  string `json:"name"`
	Image string `json:"image"`
}

type CreateListItemRequestDto struct {
	PoiID string `json:"poiId" validate:"required,min=1"`
}

type CreateListItemResponseDto struct {
	ListID    string
	PoiID     string
	ListIndex int32
	CreatedAt time.Time
}

type ListStatusDto struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Includes bool   `json:"includes"`
}

type GetListStatusResponseDto struct {
	Statuses []ListStatusDto `json:"statuses"`
}
