package mapper

import (
	"context"
	"encoding/json"
	"fmt"
	"time"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/utils"

	"github.com/danielgtaylor/huma/v2"
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

func FromDbPoisToPois(ctx context.Context, dbPois []db.GetPoisByIdsPopulatedRow) ([]dto.Poi, error) {
	_, sp := tracing.NewSpan(ctx)
	defer sp.End()

	pois := make([]dto.Poi, len(dbPois))

	for i, dbPoi := range dbPois {
		var amenities []dto.Amenity = []dto.Amenity{}

		if len(dbPoi.Amenities) != 0 {
			err := json.Unmarshal(dbPoi.Amenities, &amenities)

			if err != nil {
				return nil, huma.Error500InternalServerError("failed to unmarshal amenities")
			}
		}

		var dbMedia []db.Medium = []db.Medium{}

		if len(dbPoi.Media) != 0 {
			err := json.Unmarshal(dbPoi.Media, &dbMedia)

			if err != nil {
				return nil, huma.Error500InternalServerError("failed to unmarshal media")
			}
		}

		media := ToMedia(dbMedia)
		openHours, err := ToOpenHours(dbPoi.Poi.OpenTimes)

		if err != nil {
			return nil, huma.Error500InternalServerError("failed to unmarshal open times")
		}

		pois[i] = ToPoi(dbPoi.Poi, dbPoi.Category, dbPoi.Address, dbPoi.City, amenities, openHours, media)
	}

	return pois, nil
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

func ToProfile(dbProfile db.GetUserProfileByUsernameRow) dto.Profile {
	return dto.Profile{
		ID:                dbProfile.ID,
		Username:          dbProfile.Username,
		FullName:          dbProfile.FullName,
		IsBusinessAccount: dbProfile.IsBusinessAccount,
		IsVerified:        dbProfile.IsVerified,
		Bio:               utils.TextToStr(dbProfile.Bio),
		Pronouns:          utils.TextToStr(dbProfile.Pronouns),
		Website:           utils.TextToStr(dbProfile.Website),
		Phone:             utils.TextToStr(dbProfile.Phone),
		ProfileImage:      utils.TextToStr(dbProfile.ProfileImage),
		BannerImage:       utils.TextToStr(dbProfile.BannerImage),
		FollowersCount:    dbProfile.FollowersCount,
		FollowingCount:    dbProfile.FollowingCount,
		CreatedAt:         dbProfile.CreatedAt.Time,
	}
}

func FromUserToProfile(dbUser db.User) dto.Profile {
	return dto.Profile{
		ID:                dbUser.ID,
		Username:          dbUser.Username,
		FullName:          dbUser.FullName,
		IsBusinessAccount: dbUser.IsBusinessAccount,
		IsVerified:        dbUser.IsVerified,
		Bio:               utils.TextToStr(dbUser.Bio),
		Pronouns:          utils.TextToStr(dbUser.Pronouns),
		Website:           utils.TextToStr(dbUser.Website),
		Phone:             utils.TextToStr(dbUser.Phone),
		ProfileImage:      utils.TextToStr(dbUser.ProfileImage),
		BannerImage:       utils.TextToStr(dbUser.BannerImage),
		FollowersCount:    dbUser.FollowersCount,
		FollowingCount:    dbUser.FollowingCount,
		CreatedAt:         dbUser.CreatedAt.Time,
	}
}

func ToFollowers(dbFollowers []db.GetUserFollowersRow) []dto.Profile {
	followers := make([]dto.Profile, len(dbFollowers))

	for i, v := range dbFollowers {
		followers[i] = ToProfile(db.GetUserProfileByUsernameRow{
			ID:                v.User.ID,
			Username:          v.User.Username,
			FullName:          v.User.FullName,
			IsBusinessAccount: v.User.IsBusinessAccount,
			IsVerified:        v.User.IsVerified,
			Bio:               v.User.Bio,
			Pronouns:          v.User.Pronouns,
			Website:           v.User.Website,
			Phone:             v.User.Phone,
			ProfileImage:      v.User.ProfileImage,
			BannerImage:       v.User.BannerImage,
			FollowersCount:    v.User.FollowersCount,
			FollowingCount:    v.User.FollowingCount,
			CreatedAt:         v.User.CreatedAt,
		})
	}

	return followers
}

func ToFollowing(dbFollowing []db.GetUserFollowingRow) []dto.Profile {
	following := make([]dto.Profile, len(dbFollowing))

	for i, v := range dbFollowing {
		following[i] = ToProfile(db.GetUserProfileByUsernameRow{
			ID:                v.User.ID,
			Username:          v.User.Username,
			FullName:          v.User.FullName,
			IsBusinessAccount: v.User.IsBusinessAccount,
			IsVerified:        v.User.IsVerified,
			Bio:               v.User.Bio,
			Pronouns:          v.User.Pronouns,
			Website:           v.User.Website,
			Phone:             v.User.Phone,
			ProfileImage:      v.User.ProfileImage,
			BannerImage:       v.User.BannerImage,
			FollowersCount:    v.User.FollowersCount,
			FollowingCount:    v.User.FollowingCount,
			CreatedAt:         v.User.CreatedAt,
		})
	}

	return following
}

func FromSearchToFollowing(dbFollowing []db.SearchUserFollowingRow) []dto.Profile {
	following := make([]dto.Profile, len(dbFollowing))

	for i, v := range dbFollowing {
		following[i] = ToProfile(db.GetUserProfileByUsernameRow{
			ID:                v.User.ID,
			Username:          v.User.Username,
			FullName:          v.User.FullName,
			IsBusinessAccount: v.User.IsBusinessAccount,
			IsVerified:        v.User.IsVerified,
			Bio:               v.User.Bio,
			Pronouns:          v.User.Pronouns,
			Website:           v.User.Website,
			Phone:             v.User.Phone,
			ProfileImage:      v.User.ProfileImage,
			BannerImage:       v.User.BannerImage,
			FollowersCount:    v.User.FollowersCount,
			FollowingCount:    v.User.FollowingCount,
			CreatedAt:         v.User.CreatedAt,
		})
	}

	return following
}

func ToList(dbList db.List, dbUser db.User) dto.List {
	return dto.List{
		ID:     dbList.ID,
		Name:   dbList.Name,
		UserID: dbList.UserID,
		User: dto.ListUser{
			ID:           dbUser.ID,
			Username:     dbUser.Username,
			FullName:     dbUser.FullName,
			ProfileImage: utils.TextToStr(dbUser.ProfileImage),
		},
		Items:     []dto.ListItem{},
		IsPublic:  dbList.IsPublic,
		CreatedAt: dbList.CreatedAt.Time,
		UpdatedAt: dbList.UpdatedAt.Time,
	}
}

func ToGetAllLists(dbLists []db.List, dbUser db.User) []dto.List {
	lists := make([]dto.List, len(dbLists))

	for i, v := range dbLists {
		lists[i] = ToList(v, dbUser)
	}

	return lists
}

func ToListWithItems(dbList db.GetListByIdRow, dbItems []db.GetListItemsRow) dto.List {
	items := make([]dto.ListItem, len(dbItems))

	for i, v := range dbItems {
		items[i] = ToListItem(v)
	}

	return dto.List{
		ID:     dbList.List.ID,
		Name:   dbList.List.Name,
		UserID: dbList.List.UserID,
		User: dto.ListUser{
			ID:           dbList.User.ID,
			Username:     dbList.User.Username,
			FullName:     dbList.User.FullName,
			ProfileImage: utils.TextToStr(dbList.User.ProfileImage),
		},
		Items:     items,
		IsPublic:  dbList.List.IsPublic,
		CreatedAt: dbList.List.CreatedAt.Time,
		UpdatedAt: dbList.List.UpdatedAt.Time,
	}
}

func ToListItem(dbListItem db.GetListItemsRow) dto.ListItem {
	return dto.ListItem{
		ListID:    dbListItem.ListItem.ListID,
		PoiID:     dbListItem.ListItem.PoiID,
		ListIndex: dbListItem.ListItem.ListIndex,
		CreatedAt: dbListItem.ListItem.CreatedAt.Time,
		Poi: dto.ListItemPoi{
			ID:         dbListItem.Poi.ID,
			Name:       dbListItem.Poi.Name,
			AddressID:  dbListItem.Poi.AddressID,
			Address:    ToAddress(dbListItem.Address, dbListItem.City),
			CategoryID: dbListItem.Poi.CategoryID,
			Category: dto.Category{
				ID:    dbListItem.Category.ID,
				Name:  dbListItem.Category.Name,
				Image: dbListItem.Category.Image,
			},
			FirstMedia: ToMedia([]db.Medium{dbListItem.Medium})[0],
		},
	}
}

func ToReview(dbReview db.GetReviewsByIdsPopulatedRow) dto.Review {
	return dto.Review{
		ID:        dbReview.Review.ID,
		PoiID:     dbReview.Poi.ID,
		UserID:    dbReview.Profile.ID,
		Content:   dbReview.Review.Content,
		Rating:    dbReview.Review.Rating,
		CreatedAt: dbReview.Review.CreatedAt.Time,
		UpdatedAt: dbReview.Review.UpdatedAt.Time,
		Poi: dto.ReviewPoi{
			ID:   dbReview.Poi.ID,
			Name: dbReview.Poi.Name,
		},
		User: dto.Profile{
			ID:                dbReview.Profile.ID,
			Username:          dbReview.Profile.Username,
			FullName:          dbReview.Profile.FullName,
			IsBusinessAccount: dbReview.Profile.IsBusinessAccount,
			IsVerified:        dbReview.Profile.IsVerified,
			Bio:               utils.TextToStr(dbReview.Profile.Bio),
			Pronouns:          utils.TextToStr(dbReview.Profile.Pronouns),
			Website:           utils.TextToStr(dbReview.Profile.Website),
			Phone:             utils.TextToStr(dbReview.Profile.Phone),
			ProfileImage:      utils.TextToStr(dbReview.Profile.ProfileImage),
			BannerImage:       utils.TextToStr(dbReview.Profile.BannerImage),
			FollowersCount:    dbReview.Profile.FollowersCount,
			FollowingCount:    dbReview.Profile.FollowingCount,
			CreatedAt:         dbReview.Profile.CreatedAt.Time,
		},
		Media: ToReviewMedia(dbReview.Media),
	}
}

func ToReviewMedia(dbReviewMediaBytes []byte) []dto.ReviewMedia {
	if len(dbReviewMediaBytes) == 0 {
		return []dto.ReviewMedia{}
	}

	media := make([]dto.ReviewMedia, 0)
	err := json.Unmarshal(dbReviewMediaBytes, &media)

	if err != nil {
		return nil
	}

	return media
}

func ToDiaryEntry(dbEntry db.GetDiaryEntriesByIdsPopulatedRow) (dto.DiaryEntry, error) {
	diaryMedium := make([]dto.DiaryMedia, 0)
	dbMedia, ok := dbEntry.Media.([]any)

	if !ok {
		return dto.DiaryEntry{}, fmt.Errorf("failed to convert media to []any")
	}

	for _, v := range dbMedia {
		cast := v.(map[string]any)
		cap := cast["caption"].(string)

		idFloat := cast["id"].(float64)
		id := int64(idFloat)

		orderFloat := cast["media_order"].(float64)
		order := int16(orderFloat)

		diaryMedium = append(diaryMedium, dto.DiaryMedia{
			ID:           id,
			DiaryEntryID: cast["diary_entry_id"].(string),
			Url:          cast["url"].(string),
			Alt:          cast["alt"].(string),
			Caption:      &cap,
			MediaOrder:   order,
		})
	}

	var user dto.Profile

	err := json.Unmarshal(dbEntry.User, &user)

	if err != nil {
		return dto.DiaryEntry{}, err
	}

	var friends []dto.Profile

	err = json.Unmarshal(dbEntry.Friends, &friends)

	if err != nil {
		return dto.DiaryEntry{}, err
	}

	locations := make([]dto.DiaryLocation, 0)
	dbLocations, ok := dbEntry.Locations.([]any)

	if !ok {
		return dto.DiaryEntry{}, fmt.Errorf("failed to convert locations to []any")
	}

	for _, v := range dbLocations {
		cast := v.(map[string]any)
		description := cast["description"].(string)
		indexFloat := cast["index"].(float64)
		index := int32(indexFloat)
		poi := cast["poi"].(map[string]any)
		openTimes := poi["open_times"].(map[string]any)

		openHours := make(map[string]dto.OpenHours)

		for k, v := range openTimes {
			openCast := v.(map[string]any)

			openHours[k] = dto.OpenHours{
				OpensAt:  openCast["opensAt"].(string),
				ClosesAt: openCast["closesAt"].(string),
			}
		}

		var poiPhone, poiWebsite string

		if poi["phone"] != nil {
			poiPhone = poi["phone"].(string)
		}

		if poi["website"] != nil {
			poiWebsite = poi["website"].(string)
		}

		updatedAt, err := time.Parse(time.RFC3339, poi["updated_at"].(string))

		if err != nil {
			return dto.DiaryEntry{}, fmt.Errorf("failed to parse time: %w", err)
		}

		createdAt, err := time.Parse(time.RFC3339, poi["created_at"].(string))

		if err != nil {
			return dto.DiaryEntry{}, fmt.Errorf("failed to parse time: %w", err)
		}

		poiCategory := cast["poiCategory"].(map[string]any)
		poiAddress := cast["poiAddress"].(map[string]any)
		poiCity := cast["poiCity"].(map[string]any)
		poiAmenities := cast["poiAmenities"].([]any)
		poiMedia := cast["poiMedia"].([]any)

		var line2, postalCode string
		var imgLicense, imgLicenseLink, imgAttr, imgAttrLink string

		if poiAddress["line2"] != nil {
			line2 = poiAddress["line2"].(string)
		}

		if poiAddress["postal_code"] != nil {
			postalCode = poiAddress["postal_code"].(string)
		}

		if poiCity["img_license"] != nil {
			imgLicense = poiCity["img_license"].(string)
		}

		if poiCity["img_license_link"] != nil {
			imgLicenseLink = poiCity["img_license_link"].(string)
		}

		if poiCity["img_attr"] != nil {
			imgAttr = poiCity["img_attr"].(string)
		}

		if poiCity["img_attr_link"] != nil {
			imgAttrLink = poiCity["img_attr_link"].(string)
		}

		amenities := make([]dto.Amenity, len(poiAmenities))

		for i, a := range poiAmenities {
			cast := a.(map[string]any)
			amenities[i] = dto.Amenity{
				ID:   int32(cast["id"].(float64)),
				Name: cast["name"].(string),
			}
		}

		poiMedias := make([]dto.Media, len(poiMedia))

		for i, m := range poiMedia {
			cast := m.(map[string]any)
			var cap string

			if cast["caption"] != nil {
				cap = cast["caption"].(string)
			}

			createdAt, err := time.Parse(time.RFC3339, cast["created_at"].(string))

			if err != nil {
				return dto.DiaryEntry{}, fmt.Errorf("failed to parse time: %w", err)
			}

			poiMedias[i] = dto.Media{
				ID:         int64(cast["id"].(float64)),
				PoiID:      cast["poi_id"].(string),
				Url:        cast["url"].(string),
				Alt:        cast["alt"].(string),
				Caption:    &cap,
				MediaOrder: int16(cast["media_order"].(float64)),
				CreatedAt:  createdAt,
			}
		}

		locations = append(locations, dto.DiaryLocation{
			Description: &description,
			ListIndex:   index,
			Poi: dto.Poi{
				ID:                 poi["id"].(string),
				Name:               poi["name"].(string),
				Description:        poi["description"].(string),
				Phone:              &poiPhone,
				Website:            &poiWebsite,
				PriceLevel:         int16(poi["price_level"].(float64)),
				AccessibilityLevel: int16(poi["accessibility_level"].(float64)),
				TotalVotes:         int32(poi["total_votes"].(float64)),
				TotalPoints:        int32(poi["total_points"].(float64)),
				TotalFavorites:     int32(poi["total_favorites"].(float64)),
				UpdatedAt:          updatedAt,
				CreatedAt:          createdAt,
				AddressID:          int32(poi["address_id"].(float64)),
				CategoryID:         int16(poi["category_id"].(float64)),
				Category: dto.Category{
					ID:    int16(poiCategory["id"].(float64)),
					Name:  poiCategory["name"].(string),
					Image: poiCategory["image"].(string),
				},
				Address: dto.Address{
					ID:         int32(poiAddress["id"].(float64)),
					CityID:     int32(poiAddress["city_id"].(float64)),
					Line1:      poiAddress["line1"].(string),
					Line2:      &line2,
					PostalCode: &postalCode,
					Lat:        poiAddress["lat"].(float64),
					Lng:        poiAddress["lng"].(float64),
					City: dto.City{
						ID:   int32(poiCity["id"].(float64)),
						Name: poiCity["name"].(string),
						State: dto.CityState{
							Code: poiCity["state_code"].(string),
							Name: poiCity["state_name"].(string),
						},
						Country: dto.CityCountry{
							Code: poiCity["country_code"].(string),
							Name: poiCity["country_name"].(string),
						},
						Description: poiCity["description"].(string),
						Coordinates: dto.CityCoordinates{
							Latitude:  poiCity["latitude"].(float64),
							Longitude: poiCity["longitude"].(float64),
						},
						Image: dto.CityImage{
							Url:             poiCity["image_url"].(string),
							License:         &imgLicense,
							LicenseLink:     &imgLicenseLink,
							Attribution:     &imgAttr,
							AttributionLink: &imgAttrLink,
						},
					},
				},
				Amenities: amenities,
				Media:     poiMedias,
				OpenTimes: openHours,
			},
		})
	}

	return dto.DiaryEntry{
		ID:               dbEntry.ID,
		UserID:           dbEntry.UserID,
		Title:            dbEntry.Title,
		Description:      dbEntry.Description,
		ShareWithFriends: dbEntry.ShareWithFriends,
		Date:             dbEntry.Date.Time,
		CreatedAt:        dbEntry.CreatedAt.Time,
		UpdatedAt:        dbEntry.UpdatedAt.Time,
		Media:            diaryMedium,
		User:             user,
		Friends:          friends,
		Locations:        locations,
	}, nil
}

func ToCollection(dbCollection db.GetCollectionsByIdsPopulatedRow) (dto.Collection, error) {
	items := make([]dto.CollectionItem, 0)

	dbItems, ok := dbCollection.Items.([]any)

	if !ok {
		return dto.Collection{}, fmt.Errorf("failed to convert items to []any")
	}

	for _, v := range dbItems {
		cast := v.(map[string]any)

		t, err := time.Parse(time.RFC3339, cast["created_at"].(string))

		if err != nil {
			return dto.Collection{}, fmt.Errorf("failed to parse time: %w", err)
		}

		poi := cast["poi"].(map[string]any)
		openTimes := poi["open_times"].(map[string]any)

		openHours := make(map[string]dto.OpenHours)

		for k, v := range openTimes {
			openCast := v.(map[string]any)

			openHours[k] = dto.OpenHours{
				OpensAt:  openCast["opensAt"].(string),
				ClosesAt: openCast["closesAt"].(string),
			}
		}

		var poiPhone, poiWebsite string

		if poi["phone"] != nil {
			poiPhone = poi["phone"].(string)
		}

		if poi["website"] != nil {
			poiWebsite = poi["website"].(string)
		}

		updatedAt, err := time.Parse(time.RFC3339, poi["updated_at"].(string))

		if err != nil {
			return dto.Collection{}, fmt.Errorf("failed to parse time: %w", err)
		}

		createdAt, err := time.Parse(time.RFC3339, poi["created_at"].(string))

		if err != nil {
			return dto.Collection{}, fmt.Errorf("failed to parse time: %w", err)
		}

		poiCategory := cast["poiCategory"].(map[string]any)
		poiAddress := cast["poiAddress"].(map[string]any)
		poiCity := cast["poiCity"].(map[string]any)
		poiAmenities := cast["poiAmenities"].([]any)
		poiMedia := cast["poiMedia"].([]any)

		var line2, postalCode string
		var imgLicense, imgLicenseLink, imgAttr, imgAttrLink string

		if poiAddress["line2"] != nil {
			line2 = poiAddress["line2"].(string)
		}

		if poiAddress["postal_code"] != nil {
			postalCode = poiAddress["postal_code"].(string)
		}

		if poiCity["img_license"] != nil {
			imgLicense = poiCity["img_license"].(string)
		}

		if poiCity["img_license_link"] != nil {
			imgLicenseLink = poiCity["img_license_link"].(string)
		}

		if poiCity["img_attr"] != nil {
			imgAttr = poiCity["img_attr"].(string)
		}

		if poiCity["img_attr_link"] != nil {
			imgAttrLink = poiCity["img_attr_link"].(string)
		}

		amenities := make([]dto.Amenity, len(poiAmenities))

		for i, a := range poiAmenities {
			cast := a.(map[string]any)
			amenities[i] = dto.Amenity{
				ID:   int32(cast["id"].(float64)),
				Name: cast["name"].(string),
			}
		}

		poiMedias := make([]dto.Media, len(poiMedia))

		for i, m := range poiMedia {
			cast := m.(map[string]any)
			var cap string

			if cast["caption"] != nil {
				cap = cast["caption"].(string)
			}

			createdAt, err := time.Parse(time.RFC3339, cast["created_at"].(string))

			if err != nil {
				return dto.Collection{}, fmt.Errorf("failed to parse time: %w", err)
			}

			poiMedias[i] = dto.Media{
				ID:         int64(cast["id"].(float64)),
				PoiID:      cast["poi_id"].(string),
				Url:        cast["url"].(string),
				Alt:        cast["alt"].(string),
				Caption:    &cap,
				MediaOrder: int16(cast["media_order"].(float64)),
				CreatedAt:  createdAt,
			}
		}

		items = append(items, dto.CollectionItem{
			CollectionID: dbCollection.ID,
			ListIndex:    int32(cast["index"].(float64)),
			CreatedAt:    t,
			PoiID:        poi["id"].(string),
			Poi: dto.Poi{
				ID:                 poi["id"].(string),
				Name:               poi["name"].(string),
				Description:        poi["description"].(string),
				Phone:              &poiPhone,
				Website:            &poiWebsite,
				PriceLevel:         int16(poi["price_level"].(float64)),
				AccessibilityLevel: int16(poi["accessibility_level"].(float64)),
				TotalVotes:         int32(poi["total_votes"].(float64)),
				TotalPoints:        int32(poi["total_points"].(float64)),
				TotalFavorites:     int32(poi["total_favorites"].(float64)),
				UpdatedAt:          updatedAt,
				CreatedAt:          createdAt,
				AddressID:          int32(poi["address_id"].(float64)),
				CategoryID:         int16(poi["category_id"].(float64)),
				Category: dto.Category{
					ID:    int16(poiCategory["id"].(float64)),
					Name:  poiCategory["name"].(string),
					Image: poiCategory["image"].(string),
				},
				Address: dto.Address{
					ID:         int32(poiAddress["id"].(float64)),
					CityID:     int32(poiAddress["city_id"].(float64)),
					Line1:      poiAddress["line1"].(string),
					Line2:      &line2,
					PostalCode: &postalCode,
					Lat:        poiAddress["lat"].(float64),
					Lng:        poiAddress["lng"].(float64),
					City: dto.City{
						ID:   int32(poiCity["id"].(float64)),
						Name: poiCity["name"].(string),
						State: dto.CityState{
							Code: poiCity["state_code"].(string),
							Name: poiCity["state_name"].(string),
						},
						Country: dto.CityCountry{
							Code: poiCity["country_code"].(string),
							Name: poiCity["country_name"].(string),
						},
						Description: poiCity["description"].(string),
						Coordinates: dto.CityCoordinates{
							Latitude:  poiCity["latitude"].(float64),
							Longitude: poiCity["longitude"].(float64),
						},
						Image: dto.CityImage{
							Url:             poiCity["image_url"].(string),
							License:         &imgLicense,
							LicenseLink:     &imgLicenseLink,
							Attribution:     &imgAttr,
							AttributionLink: &imgAttrLink,
						},
					},
				},
				Amenities: amenities,
				Media:     poiMedias,
				OpenTimes: openHours,
			},
		})
	}

	return dto.Collection{
		ID:          dbCollection.ID,
		Name:        dbCollection.Name,
		Description: dbCollection.Description,
		CreatedAt:   dbCollection.CreatedAt.Time.Format(time.DateOnly),
		Items:       items,
	}, nil
}

func ToTrip(dbTrip db.GetTripsByIdsPopulatedRow) (dto.Trip, error) {
	var status dto.TripStatus = dto.TRIP_STATUS_DRAFT

	if dbTrip.Trip.Status == "active" {
		status = dto.TRIP_STATUS_ACTIVE
	} else if dbTrip.Trip.Status == "canceled" {
		status = dto.TRIP_STATUS_CANCELED
	} else if dbTrip.Trip.Status == "draft" {
		status = dto.TRIP_STATUS_DRAFT
	} else {
		return dto.Trip{}, fmt.Errorf("invalid status: %s", dbTrip.Trip.Status)
	}

	var visibility dto.TripVisibilityLevel = dto.TRIP_VISIBILITY_LEVEL_PRIVATE

	if dbTrip.Trip.VisibilityLevel == "public" {
		visibility = dto.TRIP_VISIBILITY_LEVEL_PUBLIC
	} else if dbTrip.Trip.VisibilityLevel == "friends" {
		visibility = dto.TRIP_VISIBILITY_LEVEL_FRIENDS
	} else if dbTrip.Trip.VisibilityLevel == "private" {
		visibility = dto.TRIP_VISIBILITY_LEVEL_PRIVATE
	} else {
		return dto.Trip{}, fmt.Errorf("invalid visibility level: %s", dbTrip.Trip.VisibilityLevel)
	}

	var owner dto.TripUser

	if len(dbTrip.Owner) == 0 {
		return dto.Trip{}, fmt.Errorf("failed to get owner")
	}

	err := json.Unmarshal(dbTrip.Owner, &owner)

	if err != nil {
		return dto.Trip{}, fmt.Errorf("failed to unmarshal owner: %v", err)
	}

	var amenities []dto.Amenity

	if len(dbTrip.Amenities) != 0 {
		err := json.Unmarshal(dbTrip.Amenities, &amenities)

		if err != nil {
			return dto.Trip{}, fmt.Errorf("failed to unmarshal amenities: %v", err)
		}
	} else {
		amenities = make([]dto.Amenity, 0)
	}

	var participants []dto.TripUser

	if len(dbTrip.Participants) != 0 {
		err := json.Unmarshal(dbTrip.Participants, &participants)

		if err != nil {
			return dto.Trip{}, fmt.Errorf("failed to unmarshal participants: %v", err)
		}
	} else {
		participants = make([]dto.TripUser, 0)
	}

	var comments []dto.TripComment

	if len(dbTrip.Comments) != 0 {
		err := json.Unmarshal(dbTrip.Comments, &comments)

		if err != nil {
			return dto.Trip{}, fmt.Errorf("failed to unmarshal comments: %v", err)
		}
	} else {
		comments = make([]dto.TripComment, 0)
	}

	var tripDays []dto.TripDay

	if len(dbTrip.Days) != 0 {
		err := json.Unmarshal(dbTrip.Days, &tripDays)

		if err != nil {
			return dto.Trip{}, fmt.Errorf("failed to unmarshal trip days: %v", err)
		}
	} else {
		tripDays = make([]dto.TripDay, 0)
	}

	type Location struct {
		DayNo  int32  `json:"dayNo"`
		PoiID  string `json:"poiId"`
		TripID string `json:"tripId"`
	}

	var locations []Location

	if len(dbTrip.Locations) != 0 {
		err := json.Unmarshal(dbTrip.Locations, &locations)

		if err != nil {
			return dto.Trip{}, fmt.Errorf("failed to unmarshal locations: %v", err)
		}
	} else {
		locations = make([]Location, 0)
	}

	ps, ok := dbTrip.Ps.([]any)

	if !ok {
		return dto.Trip{}, fmt.Errorf("failed to convert ps to []any")
	}

	pois := make([]dto.Poi, 0)

	for _, p := range ps {
		cast := p.(map[string]any)

		poi := cast["poi"].(map[string]any)
		openTimes := poi["open_times"].(map[string]any)

		openHours := make(map[string]dto.OpenHours)

		for k, v := range openTimes {
			openCast := v.(map[string]any)

			openHours[k] = dto.OpenHours{
				OpensAt:  openCast["opensAt"].(string),
				ClosesAt: openCast["closesAt"].(string),
			}
		}

		var poiPhone, poiWebsite string

		if poi["phone"] != nil {
			poiPhone = poi["phone"].(string)
		}

		if poi["website"] != nil {
			poiWebsite = poi["website"].(string)
		}

		updatedAt, err := time.Parse(time.RFC3339, poi["updated_at"].(string))

		if err != nil {
			return dto.Trip{}, fmt.Errorf("failed to parse time: %w", err)
		}

		createdAt, err := time.Parse(time.RFC3339, poi["created_at"].(string))

		if err != nil {
			return dto.Trip{}, fmt.Errorf("failed to parse time: %w", err)
		}

		poiCategory := cast["poiCategory"].(map[string]any)
		poiAddress := cast["poiAddress"].(map[string]any)
		poiCity := cast["poiCity"].(map[string]any)
		poiAmenities := cast["poiAmenities"].([]any)
		poiMedia := cast["poiMedia"].([]any)

		var line2, postalCode string
		var imgLicense, imgLicenseLink, imgAttr, imgAttrLink string

		if poiAddress["line2"] != nil {
			line2 = poiAddress["line2"].(string)
		}

		if poiAddress["postal_code"] != nil {
			postalCode = poiAddress["postal_code"].(string)
		}

		if poiCity["img_license"] != nil {
			imgLicense = poiCity["img_license"].(string)
		}

		if poiCity["img_license_link"] != nil {
			imgLicenseLink = poiCity["img_license_link"].(string)
		}

		if poiCity["img_attr"] != nil {
			imgAttr = poiCity["img_attr"].(string)
		}

		if poiCity["img_attr_link"] != nil {
			imgAttrLink = poiCity["img_attr_link"].(string)
		}

		amenities := make([]dto.Amenity, len(poiAmenities))

		for i, a := range poiAmenities {
			cast := a.(map[string]any)
			amenities[i] = dto.Amenity{
				ID:   int32(cast["id"].(float64)),
				Name: cast["name"].(string),
			}
		}

		poiMedias := make([]dto.Media, len(poiMedia))

		for i, m := range poiMedia {
			cast := m.(map[string]any)
			var cap string

			if cast["caption"] != nil {
				cap = cast["caption"].(string)
			}

			createdAt, err := time.Parse(time.RFC3339, cast["created_at"].(string))

			if err != nil {
				return dto.Trip{}, fmt.Errorf("failed to parse time: %w", err)
			}

			poiMedias[i] = dto.Media{
				ID:         int64(cast["id"].(float64)),
				PoiID:      cast["poi_id"].(string),
				Url:        cast["url"].(string),
				Alt:        cast["alt"].(string),
				Caption:    &cap,
				MediaOrder: int16(cast["media_order"].(float64)),
				CreatedAt:  createdAt,
			}
		}

		pois = append(pois, dto.Poi{
			ID:                 poi["id"].(string),
			Name:               poi["name"].(string),
			Description:        poi["description"].(string),
			Phone:              &poiPhone,
			Website:            &poiWebsite,
			PriceLevel:         int16(poi["price_level"].(float64)),
			AccessibilityLevel: int16(poi["accessibility_level"].(float64)),
			TotalVotes:         int32(poi["total_votes"].(float64)),
			TotalPoints:        int32(poi["total_points"].(float64)),
			TotalFavorites:     int32(poi["total_favorites"].(float64)),
			UpdatedAt:          updatedAt,
			CreatedAt:          createdAt,
			AddressID:          int32(poi["address_id"].(float64)),
			CategoryID:         int16(poi["category_id"].(float64)),
			Category: dto.Category{
				ID:    int16(poiCategory["id"].(float64)),
				Name:  poiCategory["name"].(string),
				Image: poiCategory["image"].(string),
			},
			Address: dto.Address{
				ID:         int32(poiAddress["id"].(float64)),
				CityID:     int32(poiAddress["city_id"].(float64)),
				Line1:      poiAddress["line1"].(string),
				Line2:      &line2,
				PostalCode: &postalCode,
				Lat:        poiAddress["lat"].(float64),
				Lng:        poiAddress["lng"].(float64),
				City: dto.City{
					ID:   int32(poiCity["id"].(float64)),
					Name: poiCity["name"].(string),
					State: dto.CityState{
						Code: poiCity["state_code"].(string),
						Name: poiCity["state_name"].(string),
					},
					Country: dto.CityCountry{
						Code: poiCity["country_code"].(string),
						Name: poiCity["country_name"].(string),
					},
					Description: poiCity["description"].(string),
					Coordinates: dto.CityCoordinates{
						Latitude:  poiCity["latitude"].(float64),
						Longitude: poiCity["longitude"].(float64),
					},
					Image: dto.CityImage{
						Url:             poiCity["image_url"].(string),
						License:         &imgLicense,
						LicenseLink:     &imgLicenseLink,
						Attribution:     &imgAttr,
						AttributionLink: &imgAttrLink,
					},
				},
			},
			Amenities: amenities,
			Media:     poiMedias,
			OpenTimes: openHours,
		})
	}

	for i, day := range tripDays {
		tripDays[i].Locations = make([]dto.TripLocation, 0)

		for _, loc := range locations {
			if loc.DayNo == day.DayNo {
				var poi *dto.Poi = nil

				for _, p := range pois {
					if p.ID == loc.PoiID {
						poi = &p
					}
				}

				tripDays[i].Locations = append(tripDays[i].Locations, dto.TripLocation{
					TripID: loc.TripID,
					DayNo:  loc.DayNo,
					PoiID:  loc.PoiID,
					Poi:    *poi,
				})
			}
		}
	}

	return dto.Trip{
		ID:                 dbTrip.Trip.ID,
		OwnerID:            dbTrip.Trip.OwnerID,
		Status:             status,
		VisibilityLevel:    visibility,
		StartAt:            dbTrip.Trip.StartAt.Time,
		EndAt:              dbTrip.Trip.EndAt.Time,
		CreatedAt:          dbTrip.Trip.CreatedAt.Time,
		UpdatedAt:          dbTrip.Trip.UpdatedAt.Time,
		Owner:              owner,
		RequestedAmenities: amenities,
		Participants:       participants,
		Comments:           comments,
		Days:               tripDays,
	}, nil
}
