package favorites

import (
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/utils"
)

func mapCreateFavoriteResponseToDto(v db.Favorite) CreateFavoriteResponseDto {
	return CreateFavoriteResponseDto{
		ID:        v.ID,
		PoiID:     v.PoiID,
		UserID:    v.UserID,
		CreatedAt: v.CreatedAt.Time,
	}
}

func mapGetUserFavoritessResponseToDto(v []db.GetFavoritesByUserIdRow) GetUserFavoritesResponseDto {
	var favorites []GetFavoriteByIdResponseDto

	if v == nil {
		return GetUserFavoritesResponseDto{
			Favorites: make([]GetFavoriteByIdResponseDto, 0),
		}
	}

	for _, favorite := range v {
		favorites = append(favorites, mapGetFavoriteByIdRowToDto(favorite))
	}

	return GetUserFavoritesResponseDto{
		Favorites: favorites,
	}
}

func mapGetFavoriteByIdRowToDto(v db.GetFavoritesByUserIdRow) GetFavoriteByIdResponseDto {
	return GetFavoriteByIdResponseDto{
		ID:        v.Favorite.ID,
		PoiID:     v.Poi.ID,
		Poi:       mapPoiToDto(v),
		UserID:    v.Favorite.UserID,
		CreatedAt: v.Favorite.CreatedAt.Time,
	}
}

func mapPoiToDto(v db.GetFavoritesByUserIdRow) FavoritePoi {
	return FavoritePoi{
		ID:         v.Poi.ID,
		Name:       v.Poi.Name,
		AddressID:  v.Poi.AddressID,
		CategoryID: v.Poi.CategoryID,
		Address: FavoritePoiAddress{
			ID:     v.Address.ID,
			CityID: v.Address.CityID,
			City: FavoritePoiCity{
				ID:          v.City.ID,
				Name:        v.City.Name,
				StateCode:   v.City.StateCode,
				StateName:   v.City.StateName,
				CountryCode: v.City.CountryCode,
				CountryName: v.City.CountryName,
				ImageUrl:    v.City.ImageUrl,
				Latitude:    v.City.Latitude,
				Longitude:   v.City.Longitude,
				Description: v.City.Description,
			},
			Line1:      v.Address.Line1,
			Line2:      utils.TextOrNil(v.Address.Line2),
			PostalCode: utils.TextOrNil(v.Address.PostalCode),
			Lat:        v.Address.Lat,
			Lng:        v.Address.Lng,
		},
		Category: FavoritePoiCategory{
			ID:    v.Category.ID,
			Name:  v.Category.Name,
			Image: v.Category.Image,
		},
		FirstMedia: FavoritePoiMedia{
			ID:         v.Medium.ID,
			PoiID:      v.Poi.ID,
			Url:        v.Medium.Url,
			Alt:        v.Medium.Alt,
			Caption:    utils.TextOrNil(v.Medium.Caption),
			MediaOrder: v.Medium.MediaOrder,
			CreatedAt:  v.Medium.CreatedAt.Time,
		},
	}
}
