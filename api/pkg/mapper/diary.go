package mapper

import (
	"encoding/json"
	"fmt"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/utils"
)

func ToDiary(dbDiary db.GetDiariesRow) (dto.Diary, error) {
	friends := make([]dto.DiaryUser, 0)

	err := json.Unmarshal(dbDiary.Friends, &friends)

	if err != nil {
		return dto.Diary{}, err
	}

	images := make([]dto.DiaryImage, 0)

	err = json.Unmarshal(dbDiary.Images, &images)

	if err != nil {
		return dto.Diary{}, err
	}

	locations := make([]dto.DiaryLocation, 0)

	err = json.Unmarshal(dbDiary.Locations, &locations)

	if err != nil {
		return dto.Diary{}, err
	}

	pois, err := ToPois(dbDiary.Pois)

	if err != nil {
		return dto.Diary{}, err
	}

	for i, loc := range locations {
		var poi *dto.Poi

		for _, p := range pois {
			if p.ID == loc.PoiId {
				poi = &p
				break
			}
		}

		if poi == nil {
			return dto.Diary{}, fmt.Errorf("poi not found: %s", loc.PoiId)
		}

		locations[i].Poi = *poi
	}

	return dto.Diary{
		ID:               dbDiary.Diary.ID,
		UserID:           dbDiary.Diary.UserID,
		Title:            dbDiary.Diary.Title,
		Description:      dbDiary.Diary.Description,
		ShareWithFriends: dbDiary.Diary.ShareWithFriends,
		Date:             dbDiary.Diary.Date.Time,
		CreatedAt:        dbDiary.Diary.CreatedAt.Time,
		UpdatedAt:        dbDiary.Diary.UpdatedAt.Time,
		Owner: dto.DiaryUser{
			ID:           dbDiary.Profile.ID,
			Username:     dbDiary.Profile.Username,
			FullName:     dbDiary.Profile.FullName,
			ProfileImage: utils.TextToStr(dbDiary.Profile.ProfileImage),
		},
		Friends:   friends,
		Images:    images,
		Locations: locations,
	}, nil
}
