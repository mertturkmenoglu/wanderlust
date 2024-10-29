package diary

import (
	"context"
	"time"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/utils"

	"github.com/jackc/pgx/v5/pgtype"
)

func (r *repository) createNewDiaryEntry(userId string, dto CreateDiaryEntryRequestDto) (db.DiaryEntry, error) {
	t, err := time.Parse(time.RFC3339, dto.Date)

	if err != nil {
		return db.DiaryEntry{}, err
	}

	ctx := context.Background()
	tx, err := r.di.Db.Pool.Begin(ctx)

	if err != nil {
		return db.DiaryEntry{}, err
	}

	defer tx.Rollback(ctx)

	qtx := r.di.Db.Queries.WithTx(tx)

	entry, err := qtx.CreateNewDiaryEntry(ctx, db.CreateNewDiaryEntryParams{
		ID:               utils.GenerateId(r.di.Flake),
		UserID:           userId,
		Title:            dto.Title,
		Description:      dto.Description,
		ShareWithFriends: dto.ShareWithFriends,
		Date:             pgtype.Timestamptz{Time: t, Valid: true},
	})

	if err != nil {
		return db.DiaryEntry{}, err
	}

	for i, poi := range dto.Locations {
		_, err = qtx.CreateDiaryEntryPoi(ctx, db.CreateDiaryEntryPoiParams{
			DiaryEntryID: entry.ID,
			PoiID:        poi.ID,
			Description:  utils.NilStrToText(poi.Description),
			ListIndex:    int32(i + 1),
		})

		if err != nil {
			return db.DiaryEntry{}, err
		}
	}

	for i, friendID := range dto.Friends {
		_, err = qtx.CreateDiaryEntryUser(ctx, db.CreateDiaryEntryUserParams{
			DiaryEntryID: entry.ID,
			UserID:       friendID,
			ListIndex:    int32(i + 1),
		})

		if err != nil {
			return db.DiaryEntry{}, err
		}
	}

	err = tx.Commit(ctx)

	if err != nil {
		return db.DiaryEntry{}, err
	}

	return entry, err
}

func (r *repository) addMedia(id string, url string, fileInfo *sFileInfo) error {
	_, err := r.di.Db.Queries.CreateDiaryMedia(context.Background(), db.CreateDiaryMediaParams{
		DiaryEntryID: id,
		Url:          url,
		Alt:          fileInfo.alt,
		Caption:      utils.StrToText(fileInfo.caption),
		MediaOrder:   fileInfo.mediaOrder,
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

	return GetDiaryEntryByIdDao{
		DiaryEntry: entry,
		Users:      users,
		Pois:       pois,
	}, nil
}