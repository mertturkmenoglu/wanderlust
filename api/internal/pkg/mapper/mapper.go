package mapper

import (
	"encoding/json"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/dto"
	"wanderlust/internal/pkg/utils"
)

func ToAddress(dbAddress db.Address, dbCity db.City) dto.Address {
	return dto.Address{
		ID:         dbAddress.ID,
		CityID:     dbAddress.CityID,
		City:       ToCity(dbCity),
		Line1:      dbAddress.Line1,
		Line2:      utils.TextToStr(dbAddress.Line2),
		PostalCode: utils.TextToStr(dbAddress.PostalCode),
		Lat:        dbAddress.Lat,
		Lng:        dbAddress.Lng,
	}
}

func ToCity(dbCity db.City) dto.City {
	return dto.City{
		ID:   dbCity.ID,
		Name: dbCity.Name,
		State: dto.CityState{
			Code: dbCity.StateCode,
			Name: dbCity.StateName,
		},
		Country: dto.CityCountry{
			Code: dbCity.CountryCode,
			Name: dbCity.CountryName,
		},
		Image: dto.CityImage{
			Url:             dbCity.ImageUrl,
			License:         utils.TextToStr(dbCity.ImgLicense),
			LicenseLink:     utils.TextToStr(dbCity.ImgLicenseLink),
			Attribution:     utils.TextToStr(dbCity.ImgAttr),
			AttributionLink: utils.TextToStr(dbCity.ImgAttrLink),
		},
		Coordinates: dto.CityCoordinates{
			Latitude:  dbCity.Latitude,
			Longitude: dbCity.Longitude,
		},
		Description: dbCity.Description,
	}
}

func ToCategory(dbCategory db.Category) dto.Category {
	return dto.Category{
		ID:    dbCategory.ID,
		Name:  dbCategory.Name,
		Image: dbCategory.Image,
	}
}

func ToPoi(dbPoi db.Poi, dbCategory db.Category, dbAddress db.Address, dbCity db.City, amenities []dto.Amenity, times map[string]dto.OpenHours, media []dto.Media) dto.Poi {
	return dto.Poi{
		ID:                 dbPoi.ID,
		Name:               dbPoi.Name,
		Phone:              utils.TextToStr(dbPoi.Phone),
		Description:        dbPoi.Description,
		AddressID:          dbPoi.AddressID,
		Website:            utils.TextToStr(dbPoi.Website),
		PriceLevel:         dbPoi.PriceLevel,
		AccessibilityLevel: dbPoi.AccessibilityLevel,
		TotalVotes:         dbPoi.TotalVotes,
		TotalPoints:        dbPoi.TotalPoints,
		TotalFavorites:     dbPoi.TotalFavorites,
		CategoryID:         dbPoi.CategoryID,
		Category:           ToCategory(dbCategory),
		Amenities:          amenities,
		OpenTimes:          times,
		Media:              media,
		Address:            ToAddress(dbAddress, dbCity),
		CreatedAt:          dbPoi.CreatedAt.Time,
		UpdatedAt:          dbPoi.UpdatedAt.Time,
	}
}

func FromGetPoiAmenitiesRowToAmenities(dbAmenities []db.GetPoiAmenitiesRow) []dto.Amenity {
	amenities := make([]dto.Amenity, len(dbAmenities))

	for i, a := range dbAmenities {
		amenities[i] = dto.Amenity{
			ID:   a.Amenity.ID,
			Name: a.Amenity.Name,
		}
	}

	return amenities
}

func ToMedia(dbMedia []db.Medium) []dto.Media {
	media := make([]dto.Media, len(dbMedia))

	for i, m := range dbMedia {
		media[i] = dto.Media{
			ID:         m.ID,
			PoiID:      m.PoiID,
			Url:        m.Url,
			Alt:        m.Alt,
			Caption:    utils.TextToStr(m.Caption),
			MediaOrder: m.MediaOrder,
			CreatedAt:  m.CreatedAt.Time,
		}
	}

	return media
}

func ToOpenHours(dbOpenHours []byte) (map[string]dto.OpenHours, error) {
	var times map[string]dto.OpenHours
	err := json.Unmarshal(dbOpenHours, &times)

	return times, err
}

func ToBookmarks(dbBookmarks []db.GetBookmarksByUserIdRow) []dto.Bookmark {
	bookmarks := make([]dto.Bookmark, len(dbBookmarks))

	for i, v := range dbBookmarks {
		bookmarks[i] = dto.Bookmark{
			ID:    v.Bookmark.ID,
			PoiID: v.Bookmark.PoiID,
			Poi: dto.BookmarkPoi{
				ID:         v.Poi.ID,
				Name:       v.Poi.Name,
				AddressID:  v.Poi.AddressID,
				Address:    ToAddress(v.Address, v.City),
				CategoryID: v.Poi.CategoryID,
				Category:   ToCategory(v.Category),
				FirstMedia: ToMedia([]db.Medium{v.Medium})[0],
			},
			UserID:    v.Bookmark.UserID,
			CreatedAt: v.Bookmark.CreatedAt.Time,
		}
	}

	return bookmarks
}
