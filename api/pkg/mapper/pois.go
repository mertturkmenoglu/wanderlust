package mapper

import (
	"time"
	"wanderlust/pkg/dto"
)

type GetPoisResult []GetPoisResultItem

type OpensAt map[string]struct {
	OpensAt  string `json:"opensAt"`
	ClosesAt string `json:"closesAt"`
}

type Address struct {
	ID         int32   `json:"id"`
	CityID     int32   `json:"cityId"`
	Line1      string  `json:"line1"`
	Line2      *string `json:"line2"`
	PostalCode *string `json:"postalCode"`
	Lat        float64 `json:"lat"`
	Lng        float64 `json:"lng"`
}

type City struct {
	ID                   int32   `json:"id"`
	Name                 string  `json:"name"`
	Description          string  `json:"description"`
	StateCode            string  `json:"stateCode"`
	StateName            string  `json:"stateName"`
	CountryCode          string  `json:"countryCode"`
	CountryName          string  `json:"countryName"`
	ImageUrl             string  `json:"imageUrl"`
	ImageLicense         *string `json:"imageLicense"`
	ImageLicenseLink     *string `json:"imageLicenseLink"`
	ImageAttribution     *string `json:"imageAttribution"`
	ImageAttributionLink *string `json:"imageAttributionLink"`
	Latitude             float64 `json:"latitude"`
	Longitude            float64 `json:"longitude"`
}

type Category struct {
	ID    int16  `json:"id"`
	Name  string `json:"name"`
	Image string `json:"image"`
}

type Media struct {
	ID         int64   `json:"id"`
	Alt        *string `json:"alt"`
	Url        string  `json:"url"`
	Caption    *string `json:"caption"`
	MediaOrder int16   `json:"mediaOrder"`
}

type Amenity struct {
	ID   int32  `json:"id"`
	Name string `json:"name"`
}

type GetPoisResultItem struct {
	ID                 string    `json:"id"`
	Name               string    `json:"name"`
	Description        string    `json:"description"`
	Phone              *string   `json:"phone"`
	Website            *string   `json:"website"`
	PriceLevel         int16     `json:"priceLevel"`
	AccessibilityLevel int16     `json:"accessibilityLevel"`
	TotalVotes         int32     `json:"totalVotes"`
	TotalPoints        int32     `json:"totalPoints"`
	TotalFavorites     int32     `json:"totalFavorites"`
	CategoryID         int16     `json:"categoryId"`
	OpenTimes          OpensAt   `json:"openTimes"`
	AddressID          int32     `json:"addressId"`
	CreatedAt          time.Time `json:"createdAt"`
	UpdatedAt          time.Time `json:"updatedAt"`
	Address            Address   `json:"address"`
	City               City      `json:"city"`
	Category           Category  `json:"category"`
	Media              []Media   `json:"media"`
	Amenities          []Amenity `json:"amenities"`
}

func (item *GetPoisResultItem) ToPoi() dto.Poi {
	media := make([]dto.Media, 0)

	for _, m := range item.Media {
		var alt = ""

		if m.Alt != nil {
			alt = *m.Alt
		}

		media = append(media, dto.Media{
			ID:         m.ID,
			PoiID:      item.ID,
			Url:        m.Url,
			Alt:        alt,
			Caption:    m.Caption,
			MediaOrder: m.MediaOrder,
		})
	}

	amenities := make([]dto.Amenity, 0)

	for _, a := range item.Amenities {
		amenities = append(amenities, dto.Amenity{
			ID:   a.ID,
			Name: a.Name,
		})
	}

	open := make(map[string]dto.OpenHours)

	for k, v := range item.OpenTimes {
		open[k] = dto.OpenHours{
			OpensAt:  v.OpensAt,
			ClosesAt: v.ClosesAt,
		}
	}

	return dto.Poi{
		ID:                 item.ID,
		Name:               item.Name,
		Description:        item.Description,
		Phone:              item.Phone,
		Website:            item.Website,
		PriceLevel:         item.PriceLevel,
		AccessibilityLevel: item.AccessibilityLevel,
		TotalVotes:         item.TotalVotes,
		TotalPoints:        item.TotalPoints,
		TotalFavorites:     item.TotalFavorites,
		UpdatedAt:          item.UpdatedAt,
		CreatedAt:          item.CreatedAt,
		AddressID:          item.AddressID,
		CategoryID:         item.CategoryID,
		Category: dto.Category{
			ID:    item.CategoryID,
			Name:  item.Category.Name,
			Image: item.Category.Image,
		},
		Address: dto.Address{
			ID:         item.AddressID,
			CityID:     item.Address.CityID,
			Line1:      item.Address.Line1,
			Line2:      item.Address.Line2,
			PostalCode: item.Address.PostalCode,
			Lat:        item.Address.Lat,
			Lng:        item.Address.Lng,
			City: dto.City{
				ID:   item.City.ID,
				Name: item.City.Name,
				State: dto.CityState{
					Code: item.City.StateCode,
					Name: item.City.StateName,
				},
				Country: dto.CityCountry{
					Code: item.City.CountryCode,
					Name: item.City.CountryName,
				},
				Description: item.City.Description,
				Coordinates: dto.CityCoordinates{
					Latitude:  item.City.Latitude,
					Longitude: item.City.Longitude,
				},
				Image: dto.CityImage{
					Url:             item.City.ImageUrl,
					License:         item.City.ImageLicense,
					LicenseLink:     item.City.ImageLicenseLink,
					Attribution:     item.City.ImageAttribution,
					AttributionLink: item.City.ImageAttributionLink,
				},
			},
		},
		Amenities: amenities,
		Media:     media,
		OpenTimes: open,
	}
}
