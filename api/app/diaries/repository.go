package diaries

import (
	"context"
	"slices"
	"time"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/storage"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/utils"

	"github.com/cockroachdb/errors"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db   *db.Queries
	pool *pgxpool.Pool
}

func (r *Repository) list(ctx context.Context, ids []string) ([]dto.Diary, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbDiaries, err := r.db.GetDiaries(ctx, ids)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	if len(dbDiaries) == 0 {
		return []dto.Diary{}, nil
	}

	diaries := make([]dto.Diary, len(dbDiaries))

	for i, dbDiary := range dbDiaries {
		res, err := mapper.ToDiary(dbDiary)

		if err != nil {
			return nil, errors.Wrap(ErrFailedToList, err.Error())
		}

		diaries[i] = res
	}

	return diaries, nil
}

func (r *Repository) get(ctx context.Context, id string) (*dto.Diary, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.list(ctx, []string{id})

	if err != nil {
		return nil, err
	}

	if len(res) != 1 {
		return nil, ErrNotFound
	}

	return &res[0], nil
}

type CreateParams = db.CreateNewDiaryParams

func (r *Repository) create(ctx context.Context, params CreateParams) (*db.Diary, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.CreateNewDiary(ctx, params)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreate, err.Error())
	}

	return &res, nil
}

func (r *Repository) listAll(ctx context.Context, userId string, params dto.PaginationQueryParams) ([]dto.Diary, int64, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbRes, err := r.db.ListDiaries(ctx, db.ListDiariesParams{
		UserID: userId,
		Limit:  int32(params.PageSize),
		Offset: int32(pagination.GetOffset(params)),
	})

	if len(dbRes) == 0 {
		return []dto.Diary{}, 0, nil
	}

	if err != nil {
		return nil, 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	ids := make([]string, len(dbRes))

	for i, diary := range dbRes {
		ids[i] = diary.ID
	}

	diaries, err := r.list(ctx, ids)

	if err != nil {
		return nil, 0, err
	}

	count, err := r.countByUserId(ctx, userId)

	if err != nil {
		return nil, 0, err
	}

	return diaries, count, nil
}

func (r *Repository) countByUserId(ctx context.Context, userId string) (int64, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	count, err := r.db.CountDiaries(ctx, userId)

	if err != nil {
		return 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	return count, nil
}

func (r *Repository) listByDateRange(ctx context.Context, userId string, from time.Time, to time.Time, params dto.PaginationQueryParams) ([]dto.Diary, int64, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbRes, err := r.db.ListAndFilterDiaries(ctx, db.ListAndFilterDiariesParams{
		UserID: userId,
		Date: pgtype.Timestamptz{
			Time:  to,
			Valid: true,
		},
		Date_2: pgtype.Timestamptz{
			Time:  from,
			Valid: true,
		},
		Limit:  int32(params.PageSize),
		Offset: int32(pagination.GetOffset(params)),
	})

	if err != nil {
		return nil, 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	ids := make([]string, len(dbRes))

	for i, diary := range dbRes {
		ids[i] = diary.ID
	}

	diaries, err := r.list(ctx, ids)

	if err != nil {
		return nil, 0, err
	}

	count, err := r.countByDateRange(ctx, userId, from, to)

	if err != nil {
		return nil, 0, err
	}

	return diaries, count, nil
}

func (r *Repository) countByDateRange(ctx context.Context, userId string, from time.Time, to time.Time) (int64, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	count, err := r.db.CountDiariesFilterByRange(ctx, db.CountDiariesFilterByRangeParams{
		UserID: userId,
		Date: pgtype.Timestamptz{
			Time:  to,
			Valid: true,
		},
		Date_2: pgtype.Timestamptz{
			Time:  from,
			Valid: true,
		},
	})

	if err != nil {
		return 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	return count, nil
}

func (r *Repository) delete(ctx context.Context, id string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := r.db.DeleteDiary(ctx, id)

	if err != nil {
		return errors.Wrap(ErrFailedToDelete, err.Error())
	}

	return nil
}

func (r *Repository) addImage(ctx context.Context, id string, url string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	lastOrder, err := r.db.GetDiaryLastImageIndex(ctx, id)

	if err != nil {
		return errors.Wrap(ErrFailedToUploadImage, err.Error())
	}

	ord, ok := lastOrder.(int32)

	if !ok {
		return errors.Wrap(ErrFailedToUploadImage, "failed to cast last media order")
	}

	order, err := utils.SafeInt32ToInt16(ord)

	if err != nil {
		return errors.Wrap(ErrFailedToUploadImage, "failed to convert last media order")
	}

	order++

	_, err = r.db.CreateDiaryImage(ctx, db.CreateDiaryImageParams{
		DiaryID: id,
		Url:     url,
		Index:   order,
	})

	if err != nil {
		return errors.Wrap(ErrFailedToUploadImage, err.Error())
	}

	return nil
}

func (r *Repository) removeImage(ctx context.Context, diary *dto.Diary, mediaId int64) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tx, err := r.pool.Begin(ctx)

	if err != nil {
		return errors.Wrap(ErrFailedToDeleteImage, err.Error())
	}

	defer tx.Rollback(ctx)

	qtx := r.db.WithTx(tx)

	err = qtx.RemoveDiaryAllImages(ctx, diary.ID)

	if err != nil {
		return errors.Wrap(ErrFailedToDeleteImage, err.Error())
	}

	images := diary.Images

	slices.SortFunc(images, func(a, b dto.DiaryImage) int {
		return int(a.Index) - int(b.Index)
	})

	var index int16 = 0

	var toBeRemoved *dto.DiaryImage = nil

	for _, m := range images {
		if m.ID == mediaId {
			toBeRemoved = &m
			continue
		}

		_, err = qtx.CreateDiaryImage(ctx, db.CreateDiaryImageParams{
			DiaryID: diary.ID,
			Url:     m.Url,
			Index:   index + 1,
		})

		if err != nil {
			return errors.Wrap(ErrFailedToDeleteImage, err.Error())
		}

		index++
	}

	if toBeRemoved == nil {
		return errors.Wrap(ErrFailedToDeleteImage, "diary image not found")
	}

	filename := storage.GetFilename(ctx, toBeRemoved.Url)
	bucket, err := storage.OpenBucket(ctx, storage.BUCKET_DIARIES)

	if err != nil {
		return errors.Wrap(ErrFailedToDeleteImage, err.Error())
	}

	defer bucket.Close()

	err = bucket.Delete(ctx, filename)

	if err != nil {
		return errors.Wrap(ErrFailedToDeleteImage, err.Error())
	}

	err = tx.Commit(ctx)

	if err != nil {
		return errors.Wrap(ErrFailedToDeleteImage, err.Error())
	}

	return nil
}

func (r *Repository) updateImage(ctx context.Context, diary *dto.Diary, ids []int64) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tx, err := r.pool.Begin(ctx)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateImage, err.Error())
	}

	defer tx.Rollback(ctx)

	qtx := r.db.WithTx(tx)

	err = qtx.RemoveDiaryAllImages(ctx, diary.ID)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateImage, err.Error())
	}

	images := diary.Images

	slices.SortFunc(images, func(a, b dto.DiaryImage) int {
		return int(a.Index) - int(b.Index)
	})

	for i, imageId := range ids {
		var m *dto.DiaryImage = nil

		for _, v := range images {
			if v.ID == imageId {
				m = &v
				break
			}
		}

		if m == nil {
			return errors.Wrap(ErrFailedToUpdateImage, "diary image not found")
		}

		index, err := utils.SafeInt64ToInt16(int64(i))

		if err != nil {
			return errors.Wrap(ErrFailedToUpdateImage, "failed to convert media index")
		}

		_, err = qtx.CreateDiaryImage(ctx, db.CreateDiaryImageParams{
			DiaryID: diary.ID,
			Url:     m.Url,
			Index:   index + 1,
		})

		if err != nil {
			return errors.Wrap(ErrFailedToUpdateImage, err.Error())
		}
	}

	err = tx.Commit(ctx)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateImage, err.Error())
	}

	return nil
}

type UpdateParams = db.UpdateDiaryParams

func (r *Repository) update(ctx context.Context, params db.UpdateDiaryParams) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	_, err := r.db.UpdateDiary(ctx, params)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdate, err.Error())
	}

	return nil
}

func (r *Repository) updateFriends(ctx context.Context, diary *dto.Diary, friendIds []string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tx, err := r.pool.Begin(ctx)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateFriends, err.Error())
	}

	defer tx.Rollback(ctx)

	qtx := r.db.WithTx(tx)

	err = qtx.RemoveDiaryFriends(ctx, diary.ID)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateFriends, err.Error())
	}

	batch := make([]db.BatchCreateDiaryUsersParams, len(friendIds))

	for i, friendId := range friendIds {
		index, err := utils.SafeInt64ToInt32(int64(i))

		if err != nil {
			return errors.Wrap(ErrFailedToUpdateFriends, "failed to convert friend index")
		}

		batch[i] = db.BatchCreateDiaryUsersParams{
			DiaryID: diary.ID,
			UserID:  friendId,
			Index:   index + 1,
		}
	}

	_, err = qtx.BatchCreateDiaryUsers(ctx, batch)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateFriends, err.Error())
	}

	err = tx.Commit(ctx)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateFriends, err.Error())
	}

	return nil
}

func (r *Repository) updateLocations(ctx context.Context, diary *dto.Diary, locations []dto.UpdateDiaryLocationItem) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tx, err := r.pool.Begin(ctx)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateLocations, err.Error())
	}

	defer tx.Rollback(ctx)

	qtx := r.db.WithTx(tx)

	err = qtx.RemoveDiaryLocations(ctx, diary.ID)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateLocations, err.Error())
	}

	batch := make([]db.BatchCreateDiaryLocationsParams, len(locations))

	for i, location := range locations {
		var description *string = nil

		if location.Description != nil {
			description = location.Description
		}

		index, err := utils.SafeInt64ToInt32(int64(i))

		if err != nil {
			return errors.Wrap(ErrFailedToUpdateLocations, "failed to convert location index")
		}

		batch[i] = db.BatchCreateDiaryLocationsParams{
			DiaryID: diary.ID,
			PoiID:   location.PoiID,
			Index:   index + 1,
			Description: pgtype.Text{
				String: *description,
				Valid:  description != nil,
			},
		}
	}

	_, err = qtx.BatchCreateDiaryLocations(ctx, batch)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateLocations, err.Error())
	}

	err = tx.Commit(ctx)

	if err != nil {
		return errors.Wrap(ErrFailedToUpdateLocations, err.Error())
	}

	return nil
}
