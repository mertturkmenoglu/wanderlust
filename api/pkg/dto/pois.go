package dto

import (
	"time"

	"github.com/danielgtaylor/huma/v2"
)

type PoiHours map[string]OpenClose

type OpenClose struct {
	OpensAt  string `json:"opensAt" example:"10:00" doc:"Opening time of POI in 24H format"`
	ClosesAt string `json:"closesAt" example:"18:00" doc:"Closing time of POI in 24H format"`
}

type Poi struct {
	ID                 string    `json:"id" example:"7323488942953598976" doc:"ID of point of interest"`
	Name               string    `json:"name" example:"The Great Wall of China" doc:"Name of point of interest"`
	Phone              *string   `json:"phone" example:"+989123456789" doc:"Phone number of point of interest"`
	Description        string    `json:"description" example:"The Great Wall of China is a series of fortifications built along the northern borders of China to protect against the northern invasions." doc:"Description of point of interest"`
	AddressID          int32     `json:"addressId" example:"123456789" doc:"ID of address of point of interest"`
	Website            *string   `json:"website" example:"https://example.com" doc:"Website of point of interest"`
	PriceLevel         int16     `json:"priceLevel" example:"2" doc:"Price level of point of interest"`
	AccessibilityLevel int16     `json:"accessibilityLevel" example:"2" doc:"Accessibility level of point of interest"`
	TotalVotes         int32     `json:"totalVotes" example:"100" doc:"Total votes of point of interest"`
	TotalPoints        int32     `json:"totalPoints" example:"100" doc:"Total points of point of interest"`
	TotalFavorites     int32     `json:"totalFavorites" example:"100" doc:"Total favorites of point of interest"`
	CategoryID         int16     `json:"categoryId" example:"1" doc:"ID of category of point of interest"`
	Category           Category  `json:"category"`
	Amenities          []Amenity `json:"amenities"`
	Hours              PoiHours  `json:"hours"`
	Images             []Image   `json:"images"`
	Address            Address   `json:"address"`
	CreatedAt          time.Time `json:"createdAt" example:"2023-05-01T00:00:00Z" doc:"Created at time of point of interest"`
	UpdatedAt          time.Time `json:"updatedAt" example:"2023-05-01T00:00:00Z" doc:"Updated at time of point of interest"`
}

type Image struct {
	ID    int64  `json:"id" example:"7323488942953598976" doc:"Image ID"`
	Url   string `json:"url" example:"https://example.com/media.jpg" doc:"Image URL"`
	Alt   string `json:"alt" example:"Media of point of interest" doc:"Alt text of image"`
	Index int16  `json:"index" example:"1" doc:"Order of image"`
}

type Address struct {
	ID         int32   `json:"id" example:"1234" doc:"ID of address of point of interest"`
	CityID     int32   `json:"cityId" example:"1234" doc:"ID of city of address of point of interest"`
	City       City    `json:"city"`
	Line1      string  `json:"line1" example:"Example Street" doc:"Line 1 of address of point of interest"`
	Line2      *string `json:"line2" example:"Example Street" doc:"Line 2 of address of point of interest"`
	PostalCode *string `json:"postalCode" example:"12345" doc:"Postal code of address of point of interest"`
	Lat        float64 `json:"lat" example:"12.3456" doc:"Latitude of address of point of interest"`
	Lng        float64 `json:"lng" example:"12.3456" doc:"Longitude of address of point of interest"`
}

type GetPoiByIdInput struct {
	ID string `path:"id" validate:"required" doc:"ID of point of interest" example:"7323488942953598976"`
}

type GetPoiByIdOutput struct {
	Body GetPoiByIdOutputBody
}

type GetPoiByIdOutputBody struct {
	Poi  Poi            `json:"poi"`
	Meta GetPoiByIdMeta `json:"meta"`
}

type GetPoiByIdMeta struct {
	IsFavorite   bool `json:"isFavorite"`
	IsBookmarked bool `json:"isBookmarked"`
}

type PeekPoisOutput struct {
	Body PeekPoisOutputBody
}

type PeekPoisOutputBody struct {
	Pois []Poi `json:"pois"`
}

type UpdatePoiAddressInput struct {
	ID   string `path:"id" validate:"required" doc:"ID of POI" example:"7323488942953598976"`
	Body UpdatePoiAddressInputBody
}

type UpdatePoiAddressInputBody struct {
	CityID     int32   `json:"cityId" example:"1234" doc:"ID of city"`
	Line1      string  `json:"line1" example:"Example Street" doc:"Line 1"`
	Line2      *string `json:"line2" example:"Example Street" doc:"Line 2"`
	PostalCode *string `json:"postalCode" example:"12345" doc:"Postal code"`
	Lat        float64 `json:"lat" example:"12.3456" doc:"Latitude"`
	Lng        float64 `json:"lng" example:"12.3456" doc:"Longitude"`
}

type UpdatePoiAddressOutput struct {
	Body UpdatePoiAddressOutputBody
}

type UpdatePoiAddressOutputBody struct {
	Poi Poi `json:"poi"`
}

type UpdatePoiInfoInput struct {
	ID   string `path:"id" validate:"required" doc:"ID of POI" example:"7323488942953598976"`
	Body UpdatePoiInfoInputBody
}

type UpdatePoiInfoInputBody struct {
	Name               string  `json:"name" example:"The Great Wall of China" doc:"Name of point of interest"`
	CategoryID         int16   `json:"categoryId" example:"1" doc:"ID of category"`
	Description        string  `json:"description" example:"The Great Wall of China is a series of fortifications." doc:"Description of point of interest"`
	Phone              *string `json:"phone" example:"+989123456789" doc:"Phone number"`
	Website            *string `json:"website" example:"https://example.com" doc:"Website"`
	AccessibilityLevel int16   `json:"accessibilityLevel" example:"2" doc:"Accessibility level"`
	PriceLevel         int16   `json:"priceLevel" example:"2" doc:"Price level"`
}

type UpdatePoiInfoOutput struct {
	Body UpdatePoiInfoOutputBody
}

type UpdatePoiInfoOutputBody struct {
	Poi Poi `json:"poi"`
}

type UpdatePoiAmenitiesInput struct {
	ID   string `path:"id" validate:"required" doc:"ID of POI" example:"7323488942953598976"`
	Body UpdatePoiAmenitiesInputBody
}

type UpdatePoiAmenitiesInputBody struct {
	AmenityIds []int32 `json:"amenityIds" doc:"IDs of amenities" required:"true" uniqueItems:"true" minItems:"0" maxItems:"64"`
}

type UpdatePoiAmenitiesOutput struct {
	Body UpdatePoiAmenitiesOutputBody
}

type UpdatePoiAmenitiesOutputBody struct {
	Poi Poi `json:"poi"`
}

type UpdatePoiHoursInput struct {
	ID   string `path:"id" validate:"required" doc:"ID of POI" example:"7323488942953598976"`
	Body UpdatePoiHoursInputBody
}

type UpdatePoiHoursInputBody struct {
	Hours []UpdatePoiHoursHour `json:"hours" doc:"Hours" required:"true" minItems:"0" maxItems:"7"`
}

type UpdatePoiHoursHour struct {
	Day      string `json:"day" example:"mon" doc:"Day" required:"true" enum:"mon,tue,wed,thu,fri,sat,sun"`
	OpensAt  string `json:"opensAt" example:"10:00" doc:"Opens at" required:"true"`
	ClosesAt string `json:"closesAt" example:"18:00" doc:"Closes at" required:"true"`
}

func (body *UpdatePoiHoursInputBody) Resolve(ctx huma.Context, prefix *huma.PathBuffer) []error {
	set := make(map[string]bool)

	for _, entry := range body.Hours {
		day := entry.Day
		_, has := set[day]

		if has {
			return []error{&huma.ErrorDetail{
				Message:  "Duplicate day",
				Location: prefix.With("hours"),
				Value:    day,
			}}
		}

		set[day] = true
		open := entry.OpensAt
		close := entry.ClosesAt

		if _, err := time.Parse("15:04", open); err != nil {
			return []error{&huma.ErrorDetail{
				Message:  "Invalid opening time",
				Location: prefix.With("hours"),
				Value:    open,
			}}
		}

		if _, err := time.Parse("15:04", close); err != nil {
			return []error{&huma.ErrorDetail{
				Message:  "Invalid closing time",
				Location: prefix.With("hours"),
				Value:    close,
			}}
		}
	}

	return nil
}

type UpdatePoiHoursOutput struct {
	Body UpdatePoiHoursOutputBody
}

type UpdatePoiHoursOutputBody struct {
	Poi Poi `json:"poi"`
}

type UploadPoiImageInput struct {
	ID   string `path:"id" validate:"required" doc:"ID of POI" example:"7323488942953598976" minLength:"1" maxLength:"32"`
	Body UploadPoiImageInputBody
}

type UploadPoiImageInputBody struct {
	ID       string `json:"id" example:"7323488942953598976" doc:"ID of image" required:"true"`
	FileName string `json:"fileName" example:"7323488942953598976.png" doc:"File name of image" required:"true"`
	Url      string `json:"url" example:"https://example.com/media.jpg" doc:"URL of image" required:"true"`
	Alt      string `json:"alt" example:"Media of point of interest" doc:"Alt of image" required:"true"`
}

type UploadPoiImageOutput struct {
	Body UploadPoiImageOutputBody
}

type UploadPoiImageOutputBody struct {
	Poi Poi `json:"poi"`
}

type UpdatePoiImageInput struct {
	ID      string `path:"id" validate:"required" doc:"ID of POI" example:"7323488942953598976" minLength:"1" maxLength:"32"`
	ImageID int64  `path:"imageId" validate:"required" doc:"ID of image" example:"7323488"`
	Body    UpdatePoiImageInputBody
}

type UpdatePoiImageInputBody struct {
	Alt string `json:"alt" example:"Media of point of interest" doc:"Alt of image" required:"true"`
}

type UpdatePoiImageOutput struct {
	Body UpdatePoiImageOutputBody
}

type UpdatePoiImageOutputBody struct {
	Poi Poi `json:"poi"`
}

type DeletePoiMediaInput struct {
	ID      string `path:"id" validate:"required" doc:"ID of POI" example:"7323488942953598976" minLength:"1" maxLength:"32"`
	ImageID int64  `path:"imageId" validate:"required" doc:"ID of image" example:"1"`
}

type ReorderPoiImagesInput struct {
	ID   string `path:"id" validate:"required" doc:"ID of POI" example:"7323488942953598976" minLength:"1" maxLength:"32"`
	Body ReorderPoiImagesInputBody
}

type ReorderPoiImagesInputBody struct {
	Images []int64 `json:"images" doc:"IDs of images" required:"true" uniqueItems:"true" minItems:"0" maxItems:"16"`
}

type ReorderPoiImagesOutput struct {
	Body ReorderPoiImagesOutputBody
}

type ReorderPoiImagesOutputBody struct {
	Poi Poi `json:"poi"`
}
