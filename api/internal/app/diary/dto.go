package diary

import (
	"time"
	common_dto "wanderlust/internal/pkg/common/dto"
)

type CreateDiaryEntryRequestDto struct {
	ShareWithFriends bool                          `json:"shareWithFriends" validate:"boolean"`
	Title            string                        `json:"title" validate:"required,min=1,max=128"`
	Description      string                        `json:"description" validate:"required,min=1,max=128"`
	Date             string                        `json:"date" validate:"required,datetime=2006-01-02T15:04:05Z07:00"`
	Friends          []string                      `json:"friends" validate:"required,min=1,max=32,dive,required"`
	Locations        []CreateDiaryEntryLocationDto `json:"locations" validate:"required,min=1,max=32,dive,required"`
}

type CreateDiaryEntryLocationDto struct {
	ID          string  `json:"id" validate:"required,min=1,max=32"`
	Description *string `json:"description" validate:"min=1,max=256"`
}

type CreateDiaryEntryResponseDto struct {
	ID               string    `json:"id"`
	UserID           string    `json:"userId"`
	Title            string    `json:"title"`
	Description      string    `json:"description"`
	ShareWithFriends bool      `json:"shareWithFriends"`
	Date             time.Time `json:"date"`
	CreatedAt        time.Time `json:"createdAt"`
	UpdatedAt        time.Time `json:"updatedAt"`
}

type GetDiaryEntryByIdResponseDto struct {
	ID               string               `json:"id"`
	UserID           string               `json:"userId"`
	Title            string               `json:"title"`
	Description      string               `json:"description"`
	ShareWithFriends bool                 `json:"shareWithFriends"`
	Date             time.Time            `json:"date"`
	CreatedAt        time.Time            `json:"createdAt"`
	UpdatedAt        time.Time            `json:"updatedAt"`
	User             common_dto.Profile   `json:"user"`
	Friends          []common_dto.Profile `json:"friends"`
	Locations        []DiaryLocationDto   `json:"locations"`
}

type DiaryLocationDto struct {
	Poi         DiaryPoiDto `json:"poi"`
	Description *string     `json:"description"`
	ListIndex   int32       `json:"listIndex"`
}

type DiaryPoiDto struct {
	ID                 string              `json:"id"`
	Name               string              `json:"name"`
	Phone              *string             `json:"phone"`
	Description        string              `json:"description"`
	AddressID          int32               `json:"addressId"`
	Website            *string             `json:"website"`
	PriceLevel         int16               `json:"priceLevel"`
	AccessibilityLevel int16               `json:"accessibilityLevel"`
	TotalVotes         int32               `json:"totalVotes"`
	TotalPoints        int32               `json:"totalPoints"`
	TotalFavorites     int32               `json:"totalFavorites"`
	CategoryID         int16               `json:"categoryId"`
	CreatedAt          time.Time           `json:"createdAt"`
	UpdatedAt          time.Time           `json:"updatedAt"`
	Category           DiaryPoiCategoryDto `json:"category"`
	Address            DiaryPoiAddressDto  `json:"address"`
	FirstMedia         DiaryPoiMediaDto    `json:"firstMedia"`
}

type DiaryPoiCategoryDto struct {
	ID    int16  `json:"id"`
	Name  string `json:"name"`
	Image string `json:"image"`
}

type DiaryPoiAddressDto struct {
	ID         int32           `json:"id"`
	CityID     int32           `json:"cityId"`
	City       DiaryPoiCityDto `json:"city"`
	Line1      string          `json:"line1"`
	Line2      *string         `json:"line2"`
	PostalCode *string         `json:"postalCode"`
	Lat        float64         `json:"lat"`
	Lng        float64         `json:"lng"`
}

type DiaryPoiCityDto struct {
	ID             int32   `json:"id"`
	Name           string  `json:"name"`
	StateCode      string  `json:"stateCode"`
	StateName      string  `json:"stateName"`
	CountryCode    string  `json:"countryCode"`
	CountryName    string  `json:"countryName"`
	ImageUrl       string  `json:"imageUrl"`
	Latitude       float64 `json:"latitude"`
	Longitude      float64 `json:"longitude"`
	Description    string  `json:"description"`
	ImgLicense     *string `json:"imgLicense"`
	ImgLicenseLink *string `json:"imgLicenseLink"`
	ImgAttr        *string `json:"imgAttr"`
	ImgAttrLink    *string `json:"imgAttrLink"`
}

type DiaryPoiMediaDto struct {
	ID         int64     `json:"id"`
	PoiID      string    `json:"poiId"`
	Url        string    `json:"url"`
	Alt        string    `json:"alt"`
	Caption    *string   `json:"caption"`
	MediaOrder int16     `json:"mediaOrder"`
	CreatedAt  time.Time `json:"createdAt"`
}
