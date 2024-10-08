package collections

import "time"

type GetCollectionsResponseDto struct {
	Collections []CollectionDto `json:"collections"`
}

type CollectionDto struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
}

type GetCollectionByIdResponseDto struct {
	ID          string              `json:"id"`
	Name        string              `json:"name"`
	Description string              `json:"description"`
	CreatedAt   time.Time           `json:"createdAt"`
	Items       []CollectionItemDto `json:"items"`
}

type CollectionItemDto struct {
	CollectionID string               `json:"collectionId"`
	PoiID        string               `json:"poiId"`
	ListIndex    int32                `json:"listIndex"`
	Poi          CollectionItemPoiDto `json:"poi"`
	CreatedAt    time.Time            `json:"createdAt"`
}

type CollectionItemPoiDto struct {
	ID          string                       `json:"id"`
	Name        string                       `json:"name"`
	Description string                       `json:"description"`
	AddressID   int32                        `json:"addressId"`
	CategoryID  int16                        `json:"categoryId"`
	CreatedAt   time.Time                    `json:"createdAt"`
	UpdatedAt   time.Time                    `json:"updatedAt"`
	Address     CollectionItemPoiAddressDto  `json:"address"`
	Category    CollectionItemPoiCategoryDto `json:"category"`
	FirstMedia  CollectionItemPoiMedia       `json:"firstMedia"`
}

type CollectionItemPoiMedia struct {
	ID         int64     `json:"id"`
	PoiID      string    `json:"poiId"`
	Url        string    `json:"url"`
	Alt        string    `json:"alt"`
	Caption    *string   `json:"caption"`
	MediaOrder int16     `json:"mediaOrder"`
	CreatedAt  time.Time `json:"createdAt"`
}

type CollectionItemPoiAddressDto struct {
	ID         int32                           `json:"id"`
	CityID     int32                           `json:"cityId"`
	City       CollectionItemPoiAddressCityDto `json:"city"`
	Line1      string                          `json:"line1"`
	Line2      *string                         `json:"line2"`
	PostalCode *string                         `json:"postalCode"`
	Lat        float64                         `json:"lat"`
	Lng        float64                         `json:"lng"`
}

type CollectionItemPoiAddressCityDto struct {
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

type CollectionItemPoiCategoryDto struct {
	ID    int16  `json:"id"`
	Name  string `json:"name"`
	Image string `json:"image"`
}

type CreateCollectionRequestDto struct {
	Name        string `json:"name" validate:"min=1,max=128"`
	Description string `json:"description" validate:"min=1,max=1024"`
}

type UpdateCollectionRequestDto struct {
	Name        string `json:"name" validate:"min=1,max=128"`
	Description string `json:"description" validate:"min=1,max=1024"`
}

type GetCollectionItemsResponseDto struct {
	Items []CollectionItemDto `json:"items"`
}

type CreateCollectionItemRequestDto struct {
}

type UpdateCollectionItemsRequestDto struct {
}
