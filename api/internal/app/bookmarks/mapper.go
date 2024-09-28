package bookmarks

import (
	"wanderlust/internal/db"
	"wanderlust/internal/utils"
)

func mapCreateBookmarkResponseToDto(v db.Bookmark) CreateBookmarkResponseDto {
	return CreateBookmarkResponseDto{
		ID:        v.ID,
		PoiID:     v.PoiID,
		UserID:    v.UserID,
		CreatedAt: v.CreatedAt.Time,
	}
}

func mapGetUserBookmarksResponseToDto(v []db.GetBookmarksByUserIdRow) GetUserBookmarksResponseDto {
	var bookmarks []GetBookmarkByIdResponseDto

	if v == nil {
		return GetUserBookmarksResponseDto{
			Bookmarks: make([]GetBookmarkByIdResponseDto, 0),
		}
	}

	for _, bookmark := range v {
		bookmarks = append(bookmarks, mapGetBookmarkByIdRowToDto(bookmark))
	}

	return GetUserBookmarksResponseDto{
		Bookmarks: bookmarks,
	}
}

func mapGetBookmarkByIdRowToDto(v db.GetBookmarksByUserIdRow) GetBookmarkByIdResponseDto {
	return GetBookmarkByIdResponseDto{
		ID:        v.Bookmark.ID,
		PoiID:     v.Poi.ID,
		Poi:       mapPoiToDto(v),
		UserID:    v.Bookmark.UserID,
		CreatedAt: v.Bookmark.CreatedAt.Time,
	}
}

func mapPoiToDto(v db.GetBookmarksByUserIdRow) BookmarkPoi {
	return BookmarkPoi{
		ID:         v.Poi.ID,
		Name:       v.Poi.Name,
		AddressID:  v.Poi.AddressID,
		CategoryID: v.Poi.CategoryID,
		Address: BookmarkPoiAddress{
			ID:     v.Address.ID,
			CityID: v.Address.CityID,
			City: BookmarkPoiCity{
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
		Category: BookmarkPoiCategory{
			ID:    v.Category.ID,
			Name:  v.Category.Name,
			Image: v.Category.Image,
		},
		FirstMedia: BookmarkPoiMedia{
			ID:         v.Medium.ID,
			PoiID:      v.Poi.ID,
			Url:        v.Medium.Url,
			Thumbnail:  v.Medium.Thumbnail,
			Alt:        v.Medium.Alt,
			Caption:    utils.TextOrNil(v.Medium.Caption),
			Width:      v.Medium.Width,
			Height:     v.Medium.Height,
			MediaOrder: v.Medium.MediaOrder,
			Extension:  v.Medium.Extension,
			MimeType:   v.Medium.MimeType,
			FileSize:   v.Medium.FileSize,
			CreatedAt:  v.Medium.CreatedAt.Time,
		},
	}
}
