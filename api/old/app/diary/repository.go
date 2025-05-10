package diary

import (
	"context"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/utils"
)

func (r *repository) addMedia(id string, url string, fileInfo *sFileInfo) error {
	order := fileInfo.mediaOrder

	if order == -1 {
		lastMediaOrder, err := r.di.Db.Queries.GetLastMediaOrderOfEntry(context.Background(), id)

		if err != nil {
			return err
		}

		ord, ok := lastMediaOrder.(int32)

		if !ok {
			return ErrMediaOrder
		}

		order = int16(ord) + 1
	}

	_, err := r.di.Db.Queries.CreateDiaryMedia(context.Background(), db.CreateDiaryMediaParams{
		DiaryEntryID: id,
		Url:          url,
		Alt:          fileInfo.alt,
		Caption:      utils.StrToText(fileInfo.caption),
		MediaOrder:   order,
	})

	return err
}

func (r *repository) getDiaryEntryById(id string) (GetDiaryEntryByIdDao, error) {
	entry, err := r.di.Db.Queries.GetDiaryEntryById(context.Background(), id)

	if err != nil {
		return GetDiaryEntryByIdDao{}, err
	}

	users, err := r.di.Db.Queries.GetDiaryEntryUsers(context.Background(), id)

	if err != nil {
		return GetDiaryEntryByIdDao{}, err
	}

	pois, err := r.di.Db.Queries.GetDiaryEntryPois(context.Background(), id)

	if err != nil {
		return GetDiaryEntryByIdDao{}, err
	}

	media, err := r.getDiaryMedia(id)

	if err != nil {
		return GetDiaryEntryByIdDao{}, err
	}

	return GetDiaryEntryByIdDao{
		DiaryEntry: entry,
		Users:      users,
		Pois:       pois,
		Media:      media,
	}, nil
}

func (r *repository) getDiaryMedia(id string) ([]db.DiaryMedium, error) {
	return r.di.Db.Queries.GetDiaryMedia(context.Background(), id)
}
