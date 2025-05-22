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

func ToDiaryEntryMedia(dbEntryMedia any) ([]dto.DiaryMedia, error) {
	diaryMedium := make([]dto.DiaryMedia, 0)
	dbMedia, ok := dbEntryMedia.([]any)

	if !ok {
		return []dto.DiaryMedia{}, fmt.Errorf("failed to convert media to []any")
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

	return diaryMedium, nil
}

func ToProfileFromBytes(bytes []byte) (dto.Profile, error) {
	var object map[string]any

	err := json.Unmarshal(bytes, &object)

	if err != nil {
		return dto.Profile{}, err
	}

	var bio, pronouns, website, phone, profileImage, bannerImage *string

	if object["bio"] != nil {
		cast := object["bio"].(string)
		bio = &cast
	}

	if object["pronouns"] != nil {
		cast := object["pronouns"].(string)
		pronouns = &cast
	}

	if object["website"] != nil {
		cast := object["website"].(string)
		website = &cast
	}

	if object["phone"] != nil {
		cast := object["phone"].(string)
		phone = &cast
	}

	if object["profile_image"] != nil {
		cast := object["profile_image"].(string)
		profileImage = &cast
	}

	if object["banner_image"] != nil {
		cast := object["banner_image"].(string)
		bannerImage = &cast
	}

	createdAt, err := time.Parse(time.RFC3339, object["created_at"].(string))

	if err != nil {
		return dto.Profile{}, err
	}

	return dto.Profile{
		ID:                object["id"].(string),
		Username:          object["username"].(string),
		FullName:          object["full_name"].(string),
		IsBusinessAccount: object["is_business_account"].(bool),
		IsVerified:        object["is_verified"].(bool),
		Bio:               bio,
		Pronouns:          pronouns,
		Website:           website,
		Phone:             phone,
		ProfileImage:      profileImage,
		BannerImage:       bannerImage,
		FollowersCount:    int32(object["followers_count"].(float64)),
		FollowingCount:    int32(object["following_count"].(float64)),
		CreatedAt:         createdAt,
	}, nil
}

type PoiAggregateResult struct {
	Poi          map[string]any
	PoiAddress   map[string]any
	PoiAmenities []any
	PoiCategory  map[string]any
	PoiCity      map[string]any
	PoiMedia     []any
}

// Lord forgive me for what I'm about to write.
// This is a horrible hacky way to convert database results to DTOs.
// But, whatever. It works.
func ToPoiFromAggregateResult(agg PoiAggregateResult) (dto.Poi, error) {
	poi := agg.Poi
	openTimes := poi["open_times"].(map[string]any)
	openHours := make(map[string]dto.OpenHours)

	for k, v := range openTimes {
		openCast := v.(map[string]any)

		openHours[k] = dto.OpenHours{
			OpensAt:  openCast["opensAt"].(string),
			ClosesAt: openCast["closesAt"].(string),
		}
	}

	var phone, website *string

	if poi["phone"] != nil {
		value := poi["phone"].(string)
		phone = &value
	}

	if poi["website"] != nil {
		value := poi["website"].(string)
		website = &value
	}

	updatedAt, err := time.Parse(time.RFC3339, poi["updated_at"].(string))

	if err != nil {
		return dto.Poi{}, fmt.Errorf("failed to parse time: %w", err)
	}

	createdAt, err := time.Parse(time.RFC3339, poi["created_at"].(string))

	if err != nil {
		return dto.Poi{}, fmt.Errorf("failed to parse time: %w", err)
	}

	poiCategory := agg.PoiCategory
	poiAddress := agg.PoiAddress
	poiCity := agg.PoiCity
	poiAmenities := agg.PoiAmenities
	poiMedia := agg.PoiMedia

	var line2, postalCode *string
	var imgLicense, imgLicenseLink, imgAttr, imgAttrLink *string

	if poiAddress["line2"] != nil {
		value := poiAddress["line2"].(string)
		line2 = &value
	}

	if poiAddress["postal_code"] != nil {
		value := poiAddress["postal_code"].(string)
		postalCode = &value
	}

	if poiCity["img_license"] != nil {
		value := poiCity["img_license"].(string)
		imgLicense = &value
	}

	if poiCity["img_license_link"] != nil {
		value := poiCity["img_license_link"].(string)
		imgLicenseLink = &value
	}

	if poiCity["img_attr"] != nil {
		value := poiCity["img_attr"].(string)
		imgAttr = &value
	}

	if poiCity["img_attr_link"] != nil {
		value := poiCity["img_attr_link"].(string)
		imgAttrLink = &value
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
		var cap *string

		if cast["caption"] != nil {
			value := cast["caption"].(string)
			cap = &value
		}

		createdAt, err := time.Parse(time.RFC3339, cast["created_at"].(string))

		if err != nil {
			return dto.Poi{}, fmt.Errorf("failed to parse time: %w", err)
		}

		poiMedias[i] = dto.Media{
			ID:         int64(cast["id"].(float64)),
			PoiID:      cast["poi_id"].(string),
			Url:        cast["url"].(string),
			Alt:        cast["alt"].(string),
			Caption:    cap,
			MediaOrder: int16(cast["media_order"].(float64)),
			CreatedAt:  createdAt,
		}
	}

	return dto.Poi{
		ID:                 poi["id"].(string),
		Name:               poi["name"].(string),
		Description:        poi["description"].(string),
		Phone:              phone,
		Website:            website,
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
			Line2:      line2,
			PostalCode: postalCode,
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
					License:         imgLicense,
					LicenseLink:     imgLicenseLink,
					Attribution:     imgAttr,
					AttributionLink: imgAttrLink,
				},
			},
		},
		Amenities: amenities,
		Media:     poiMedias,
		OpenTimes: openHours,
	}, nil
}

func ToDiaryEntryLocations(dbLocations any) ([]dto.DiaryLocation, error) {
	locations := make([]dto.DiaryLocation, 0)

	locationsArray, ok := dbLocations.([]any)

	if !ok {
		return []dto.DiaryLocation{}, fmt.Errorf("failed to convert diary locations")
	}

	for _, location := range locationsArray {
		object := location.(map[string]any)

		var description *string

		if object["description"] != nil {
			value := object["description"].(string)
			description = &value
		}

		poi, err := ToPoiFromAggregateResult(PoiAggregateResult{
			Poi:          object["poi"].(map[string]any),
			PoiAddress:   object["poiAddress"].(map[string]any),
			PoiAmenities: object["poiAmenities"].([]any),
			PoiCategory:  object["poiCategory"].(map[string]any),
			PoiCity:      object["poiCity"].(map[string]any),
			PoiMedia:     object["poiMedia"].([]any),
		})

		if err != nil {
			return []dto.DiaryLocation{}, err
		}

		locations = append(locations, dto.DiaryLocation{
			Description: description,
			Poi:         poi,
			ListIndex:   int32(object["index"].(float64)),
		})
	}

	return locations, nil
}

func ToDiaryEntry(dbEntry db.GetDiaryEntriesByIdsPopulatedRow) (dto.DiaryEntry, error) {
	media, err := ToDiaryEntryMedia(dbEntry.Media)

	if err != nil {
		return dto.DiaryEntry{}, err
	}

	user, err := ToProfileFromBytes(dbEntry.User)

	if err != nil {
		return dto.DiaryEntry{}, err
	}

	friends := make([]dto.Profile, 0)

	if len(dbEntry.Friends) > 0 {
		var objects []any = []any{}

		err = json.Unmarshal(dbEntry.Friends, &friends)

		if err != nil {
			return dto.DiaryEntry{}, err
		}

		for _, v := range objects {
			bytes, err := json.Marshal(v)

			if err != nil {
				return dto.DiaryEntry{}, err
			}

			friend, err := ToProfileFromBytes(bytes)

			if err != nil {
				return dto.DiaryEntry{}, err
			}

			friends = append(friends, friend)
		}
	}

	locations, err := ToDiaryEntryLocations(dbEntry.Locations)

	if err != nil {
		return dto.DiaryEntry{}, err
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
		Media:            media,
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

		poi, err := ToPoiFromAggregateResult(PoiAggregateResult{
			Poi:          cast["poi"].(map[string]any),
			PoiAddress:   cast["poiAddress"].(map[string]any),
			PoiAmenities: cast["poiAmenities"].([]any),
			PoiCategory:  cast["poiCategory"].(map[string]any),
			PoiCity:      cast["poiCity"].(map[string]any),
			PoiMedia:     cast["poiMedia"].([]any),
		})

		if err != nil {
			return dto.Collection{}, err
		}

		items = append(items, dto.CollectionItem{
			CollectionID: dbCollection.ID,
			ListIndex:    int32(cast["index"].(float64)),
			CreatedAt:    t,
			PoiID:        poi.ID,
			Poi:          poi,
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

func ToTripStatus(dbStatus string) (dto.TripStatus, error) {
	switch dbStatus {
	case "active":
		return dto.TRIP_STATUS_ACTIVE, nil
	case "canceled":
		return dto.TRIP_STATUS_CANCELED, nil
	case "draft":
		return dto.TRIP_STATUS_DRAFT, nil
	default:
		return "", fmt.Errorf("invalid status: %s", dbStatus)
	}
}

func ToTripVisibilityLevel(dbVisibility string) (dto.TripVisibilityLevel, error) {
	switch dbVisibility {
	case "public":
		return dto.TRIP_VISIBILITY_LEVEL_PUBLIC, nil
	case "friends":
		return dto.TRIP_VISIBILITY_LEVEL_FRIENDS, nil
	case "private":
		return dto.TRIP_VISIBILITY_LEVEL_PRIVATE, nil
	default:
		return "", fmt.Errorf("invalid visibility level: %s", dbVisibility)
	}
}

func ToTrip(dbTrip db.GetTripsByIdsPopulatedRow) (dto.Trip, error) {
	status, err := ToTripStatus(dbTrip.Trip.Status)

	if err != nil {
		return dto.Trip{}, err
	}

	visibility, err := ToTripVisibilityLevel(dbTrip.Trip.VisibilityLevel)

	if err != nil {
		return dto.Trip{}, err
	}

	var owner dto.TripUser

	if len(dbTrip.Owner) == 0 {
		return dto.Trip{}, fmt.Errorf("failed to get owner")
	}

	err = json.Unmarshal(dbTrip.Owner, &owner)

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

	type Location struct {
		ID            string    `json:"id"`
		TripID        string    `json:"tripId"`
		ScheduledTime time.Time `json:"scheduledTime"`
		Description   string    `json:"description"`
		PoiID         string    `json:"poiId"`
	}

	var dbLocations []Location

	if len(dbTrip.Locations) != 0 {
		err := json.Unmarshal(dbTrip.Locations, &dbLocations)

		if err != nil {
			return dto.Trip{}, fmt.Errorf("failed to unmarshal locations: %v", err)
		}
	} else {
		dbLocations = make([]Location, 0)
	}

	ps, ok := dbTrip.Ps.([]any)

	if !ok {
		return dto.Trip{}, fmt.Errorf("failed to convert ps to []any")
	}

	pois := make([]dto.Poi, 0)

	for _, p := range ps {
		cast := p.(map[string]any)

		poi, err := ToPoiFromAggregateResult(PoiAggregateResult{
			Poi:          cast["poi"].(map[string]any),
			PoiAddress:   cast["poiAddress"].(map[string]any),
			PoiAmenities: cast["poiAmenities"].([]any),
			PoiCategory:  cast["poiCategory"].(map[string]any),
			PoiCity:      cast["poiCity"].(map[string]any),
			PoiMedia:     cast["poiMedia"].([]any),
		})

		if err != nil {
			return dto.Trip{}, err
		}

		pois = append(pois, poi)
	}

	locations := make([]dto.TripLocation, 0)

	for _, dbLocation := range dbLocations {
		var poi *dto.Poi = nil

		for _, p := range pois {
			if p.ID == dbLocation.PoiID {
				poi = &p
			}
		}

		if poi == nil {
			continue
		}

		locations = append(locations, dto.TripLocation{
			ID:            dbLocation.ID,
			TripID:        dbLocation.TripID,
			ScheduledTime: dbLocation.ScheduledTime,
			Description:   dbLocation.Description,
			PoiID:         dbLocation.PoiID,
			Poi:           *poi,
		})
	}

	return dto.Trip{
		ID:                 dbTrip.Trip.ID,
		OwnerID:            dbTrip.Trip.OwnerID,
		Title:              dbTrip.Trip.Title,
		Description:        dbTrip.Trip.Description,
		Status:             status,
		VisibilityLevel:    visibility,
		StartAt:            dbTrip.Trip.StartAt.Time,
		EndAt:              dbTrip.Trip.EndAt.Time,
		CreatedAt:          dbTrip.Trip.CreatedAt.Time,
		UpdatedAt:          dbTrip.Trip.UpdatedAt.Time,
		Owner:              owner,
		RequestedAmenities: amenities,
		Participants:       participants,
		Locations:          locations,
	}, nil
}

func ToTripInviteRole(dbRole string) (dto.TripRole, error) {
	switch dbRole {
	case "participant":
		return dto.TRIP_ROLE_PARTICIPANT, nil
	case "editor":
		return dto.TRIP_ROLE_EDITOR, nil
	default:
		return "", fmt.Errorf("invalid role: %s", dbRole)
	}
}

func FromToUserRowToTripInvite(dbTripInvite db.GetInvitesByToUserIdRow) (dto.TripInvite, error) {
	var role dto.TripRole = dto.TRIP_ROLE_PARTICIPANT

	role, err := ToTripInviteRole(dbTripInvite.TripInvite.Role)

	if err != nil {
		return dto.TripInvite{}, err
	}

	var fromUser dto.TripUser

	err = json.Unmarshal(dbTripInvite.Fromuser, &fromUser)

	if err != nil {
		return dto.TripInvite{}, huma.Error500InternalServerError("Failed to get invites")
	}

	return dto.TripInvite{
		ID:     dbTripInvite.TripInvite.ID,
		TripID: dbTripInvite.TripInvite.TripID,
		From:   fromUser,
		To: dto.TripUser{
			ID: dbTripInvite.TripInvite.ToID,
		},
		SentAt:          dbTripInvite.TripInvite.SentAt.Time,
		ExpiresAt:       dbTripInvite.TripInvite.ExpiresAt.Time,
		Role:            role,
		TripTitle:       dbTripInvite.TripInvite.TripTitle,
		TripDescription: dbTripInvite.TripInvite.TripDescription,
	}, nil
}

func FromTripRowToTripInvite(dbInvite db.GetInvitesByTripIdRow) (dto.TripInvite, error) {
	role, err := ToTripInviteRole(dbInvite.TripInvite.Role)

	if err != nil {
		return dto.TripInvite{}, err
	}

	var fromUser dto.TripUser

	err = json.Unmarshal(dbInvite.Fromuser, &fromUser)

	if err != nil {
		return dto.TripInvite{}, huma.Error500InternalServerError("Failed to get invites")
	}

	var toUser dto.TripUser

	err = json.Unmarshal(dbInvite.Touser, &toUser)

	if err != nil {
		return dto.TripInvite{}, huma.Error500InternalServerError("Failed to get invites")
	}

	return dto.TripInvite{
		ID:              dbInvite.TripInvite.ID,
		TripID:          dbInvite.TripInvite.TripID,
		From:            fromUser,
		To:              toUser,
		SentAt:          dbInvite.TripInvite.SentAt.Time,
		ExpiresAt:       dbInvite.TripInvite.ExpiresAt.Time,
		Role:            role,
		TripTitle:       dbInvite.TripInvite.TripTitle,
		TripDescription: dbInvite.TripInvite.TripDescription,
	}, nil
}

func ToTripComment(dbComment db.GetTripCommentsRow) (dto.TripComment, error) {
	var user dto.TripUser

	err := json.Unmarshal(dbComment.User, &user)

	if err != nil {
		return dto.TripComment{}, err
	}

	return dto.TripComment{
		ID:        dbComment.TripComment.ID,
		TripID:    dbComment.TripComment.TripID,
		Content:   dbComment.TripComment.Content,
		CreatedAt: dbComment.TripComment.CreatedAt.Time,
		From:      user,
	}, nil
}

func FromSingleDbTripCommentToTripComment(dbComment db.GetTripCommentByIdRow) (dto.TripComment, error) {
	var user dto.TripUser

	err := json.Unmarshal(dbComment.User, &user)

	if err != nil {
		return dto.TripComment{}, err
	}

	return dto.TripComment{
		ID:        dbComment.TripComment.ID,
		TripID:    dbComment.TripComment.TripID,
		Content:   dbComment.TripComment.Content,
		CreatedAt: dbComment.TripComment.CreatedAt.Time,
		From:      user,
	}, nil
}
