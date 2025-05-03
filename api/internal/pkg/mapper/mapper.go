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

func ToFavorites(dbFavorites []db.GetFavoritesByUserIdRow) []dto.Favorite {
	favorites := make([]dto.Favorite, len(dbFavorites))

	for i, v := range dbFavorites {
		favorites[i] = dto.Favorite{
			ID:    v.Favorite.ID,
			PoiID: v.Favorite.PoiID,
			Poi: dto.FavoritePoi{
				ID:         v.Poi.ID,
				Name:       v.Poi.Name,
				AddressID:  v.Poi.AddressID,
				Address:    ToAddress(v.Address, v.City),
				CategoryID: v.Poi.CategoryID,
				Category:   ToCategory(v.Category),
				FirstMedia: ToMedia([]db.Medium{v.Medium})[0],
			},
			UserID:    v.Favorite.UserID,
			CreatedAt: v.Favorite.CreatedAt.Time,
		}
	}

	return favorites
}

func FromPoiToHomeAggregatorPoi(p dto.Poi) dto.HomeAggregatorPoi {
	return dto.HomeAggregatorPoi{
		ID:         p.ID,
		Name:       p.Name,
		AddressID:  p.AddressID,
		Address:    p.Address,
		CategoryID: p.CategoryID,
		Category:   p.Category,
		FirstMedia: p.Media[0],
	}
}

func ToHomeAggregatorOutput(news []db.GetNewPoisRow, populars []db.GetPopularPoisRow, featured []db.GetFeaturedPoisRow, favorites []db.GetFavoritePoisRow) dto.HomeAggregatorOutput {
	newsArr := make([]dto.HomeAggregatorPoi, len(news))
	popularArr := make([]dto.HomeAggregatorPoi, len(populars))
	featuredArr := make([]dto.HomeAggregatorPoi, len(featured))
	favoritesArr := make([]dto.HomeAggregatorPoi, len(favorites))

	for i, v := range news {
		media := ToMedia([]db.Medium{v.Medium})
		p := ToPoi(v.Poi, v.Category, v.Address, v.City, nil, nil, media)
		newsArr[i] = FromPoiToHomeAggregatorPoi(p)
	}

	for i, v := range populars {
		media := ToMedia([]db.Medium{v.Medium})
		p := ToPoi(v.Poi, v.Category, v.Address, v.City, nil, nil, media)
		popularArr[i] = FromPoiToHomeAggregatorPoi(p)
	}

	for i, v := range featured {
		media := ToMedia([]db.Medium{v.Medium})
		p := ToPoi(v.Poi, v.Category, v.Address, v.City, nil, nil, media)
		featuredArr[i] = FromPoiToHomeAggregatorPoi(p)
	}

	for i, v := range favorites {
		media := ToMedia([]db.Medium{v.Medium})
		p := ToPoi(v.Poi, v.Category, v.Address, v.City, nil, nil, media)
		favoritesArr[i] = FromPoiToHomeAggregatorPoi(p)
	}

	return dto.HomeAggregatorOutput{
		Body: dto.HomeAggregatorOutputBody{
			New:       newsArr,
			Popular:   popularArr,
			Featured:  featuredArr,
			Favorites: favoritesArr,
		},
	}
}
