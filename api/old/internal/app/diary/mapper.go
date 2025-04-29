package diary

import (
	common_dto "wanderlust/internal/pkg/common/dto"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/utils"
)

func mapToCreateDiaryEntryResponseDto(v db.DiaryEntry) CreateDiaryEntryResponseDto {
	return CreateDiaryEntryResponseDto{
		ID:               v.ID,
		UserID:           v.UserID,
		Title:            v.Title,
		Description:      v.Description,
		ShareWithFriends: v.ShareWithFriends,
		Date:             v.Date.Time,
		CreatedAt:        v.CreatedAt.Time,
		UpdatedAt:        v.UpdatedAt.Time,
	}
}

func mapToGetDiaryEntryByIdResponseDto(v GetDiaryEntryByIdDao) GetDiaryEntryByIdResponseDto {
	friends := make([]common_dto.Profile, 0)

	for _, friend := range v.Users {
		friends = append(friends, mapToGetDiaryEntryByIdUserDto(friend.Profile))
	}

	locations := make([]DiaryLocationDto, 0)

	for _, l := range v.Pois {
		locations = append(locations, DiaryLocationDto{
			Description: utils.TextOrNil(l.DiaryEntriesPoi.Description),
			ListIndex:   l.DiaryEntriesPoi.ListIndex,
			Poi: DiaryPoiDto{
				ID:                 l.Poi.ID,
				Name:               l.Poi.Name,
				Phone:              utils.TextOrNil(l.Poi.Phone),
				Description:        l.Poi.Description,
				Website:            utils.TextOrNil(l.Poi.Website),
				PriceLevel:         l.Poi.PriceLevel,
				AccessibilityLevel: l.Poi.AccessibilityLevel,
				TotalVotes:         l.Poi.TotalVotes,
				TotalFavorites:     l.Poi.TotalFavorites,
				TotalPoints:        l.Poi.TotalPoints,
				CreatedAt:          l.Poi.CreatedAt.Time,
				UpdatedAt:          l.Poi.UpdatedAt.Time,
				CategoryID:         l.Poi.CategoryID,
				Category: DiaryPoiCategoryDto{
					ID:    l.Category.ID,
					Name:  l.Category.Name,
					Image: l.Category.Image,
				},
				AddressID: l.Poi.AddressID,
				Address: DiaryPoiAddressDto{
					ID:         l.Address.ID,
					Line1:      l.Address.Line1,
					Line2:      utils.TextOrNil(l.Address.Line2),
					PostalCode: utils.TextOrNil(l.Address.PostalCode),
					Lat:        l.Address.Lat,
					Lng:        l.Address.Lng,
					CityID:     l.Address.CityID,
					City: DiaryPoiCityDto{
						ID:             l.City.ID,
						Name:           l.City.Name,
						StateCode:      l.City.StateCode,
						StateName:      l.City.StateName,
						CountryCode:    l.City.CountryCode,
						CountryName:    l.City.CountryName,
						Latitude:       l.City.Latitude,
						Longitude:      l.City.Longitude,
						ImageUrl:       l.City.ImageUrl,
						Description:    l.City.Description,
						ImgLicense:     utils.TextOrNil(l.City.ImgLicense),
						ImgLicenseLink: utils.TextOrNil(l.City.ImgLicenseLink),
						ImgAttr:        utils.TextOrNil(l.City.ImgAttr),
						ImgAttrLink:    utils.TextOrNil(l.City.ImgAttrLink),
					},
				},
				FirstMedia: DiaryPoiMediaDto{
					ID:         l.Medium.ID,
					PoiID:      l.Medium.PoiID,
					Url:        l.Medium.Url,
					Alt:        l.Medium.Alt,
					Caption:    utils.TextOrNil(l.Medium.Caption),
					MediaOrder: l.Medium.MediaOrder,
					CreatedAt:  l.Medium.CreatedAt.Time,
				},
			},
		})
	}

	media := make([]DiaryMediaDto, 0)

	for _, m := range v.Media {
		media = append(media, DiaryMediaDto{
			ID:           m.ID,
			DiaryEntryID: m.DiaryEntryID,
			Url:          m.Url,
			Alt:          m.Alt,
			Caption:      utils.TextOrNil(m.Caption),
			MediaOrder:   m.MediaOrder,
			CreatedAt:    m.CreatedAt.Time,
		})
	}

	return GetDiaryEntryByIdResponseDto{
		ID:               v.DiaryEntry.DiaryEntry.ID,
		UserID:           v.DiaryEntry.DiaryEntry.UserID,
		Title:            v.DiaryEntry.DiaryEntry.Title,
		Description:      v.DiaryEntry.DiaryEntry.Description,
		ShareWithFriends: v.DiaryEntry.DiaryEntry.ShareWithFriends,
		Date:             v.DiaryEntry.DiaryEntry.Date.Time,
		CreatedAt:        v.DiaryEntry.DiaryEntry.CreatedAt.Time,
		UpdatedAt:        v.DiaryEntry.DiaryEntry.UpdatedAt.Time,
		User:             mapToGetDiaryEntryByIdUserDto(v.DiaryEntry.Profile),
		Friends:          friends,
		Locations:        locations,
		Media:            media,
	}
}

func mapToGetDiaryEntryByIdUserDto(v db.Profile) common_dto.Profile {
	return common_dto.Profile{
		ID:                v.ID,
		Username:          v.Username,
		FullName:          v.FullName,
		IsBusinessAccount: v.IsBusinessAccount,
		IsVerified:        v.IsVerified,
		Bio:               utils.TextOrNil(v.Bio),
		Pronouns:          utils.TextOrNil(v.Pronouns),
		Website:           utils.TextOrNil(v.Website),
		Phone:             utils.TextOrNil(v.Phone),
		ProfileImage:      utils.TextOrNil(v.ProfileImage),
		BannerImage:       utils.TextOrNil(v.BannerImage),
		FollowersCount:    v.FollowersCount,
		FollowingCount:    v.FollowingCount,
		CreatedAt:         v.CreatedAt.Time,
	}
}

func mapToListDiaryEntriesResponseDto(v []db.DiaryEntry) ListDiaryEntriesResponseDto {
	entries := make([]DiaryEntryDto, 0)

	for _, entry := range v {
		entries = append(entries, DiaryEntryDto{
			ID:               entry.ID,
			UserID:           entry.UserID,
			Title:            entry.Title,
			Description:      entry.Description,
			ShareWithFriends: entry.ShareWithFriends,
			Date:             entry.Date.Time,
			CreatedAt:        entry.CreatedAt.Time,
			UpdatedAt:        entry.UpdatedAt.Time,
		})
	}

	return ListDiaryEntriesResponseDto{
		Entries: entries,
	}
}
