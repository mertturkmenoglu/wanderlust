package mapper

import (
	"encoding/json"
	"fmt"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
)

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

func ToDiaryEntryLocations(dbLocations any, pois []dto.Poi) ([]dto.DiaryLocation, error) {
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

		poiId := object["poiId"].(string)

		var poi *dto.Poi = nil

		for _, p := range pois {
			if p.ID == poiId {
				poi = &p
			}
		}

		if poi == nil {
			continue
		}

		locations = append(locations, dto.DiaryLocation{
			Description: description,
			Poi:         *poi,
			ListIndex:   int32(object["index"].(float64)),
		})
	}

	return locations, nil
}

func ToDiaryEntryFriends(dbFriends []byte) ([]dto.Profile, error) {
	friends := make([]dto.Profile, 0)

	if len(dbFriends) > 0 {
		var objects []any = []any{}
		err := json.Unmarshal(dbFriends, &objects)

		if err != nil {
			return nil, err
		}

		for _, v := range objects {
			bytes, err := json.Marshal(v)

			if err != nil {
				return nil, err
			}

			friend, err := ToProfileFromBytes(bytes)

			if err != nil {
				return nil, err
			}

			friends = append(friends, friend)
		}
	}

	return friends, nil
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

	friends, err := ToDiaryEntryFriends(dbEntry.Friends)

	if err != nil {
		return dto.DiaryEntry{}, err
	}

	var poiResults []GetPoisResultItem

	if len(dbEntry.Pois) != 0 {
		err := json.Unmarshal(dbEntry.Pois, &poiResults)

		if err != nil {
			return dto.DiaryEntry{}, err
		}
	}

	pois := make([]dto.Poi, len(poiResults))

	for i, p := range poiResults {
		pois[i] = p.ToPoi()
	}

	locations, err := ToDiaryEntryLocations(dbEntry.Locations, pois)

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
