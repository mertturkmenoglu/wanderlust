package diaries

import (
	"context"
	"errors"
	"log/slog"
	"slices"
	"time"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/storage"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/uid"
	"wanderlust/pkg/utils"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
)

type Service struct {
	*core.Application
	db   *db.Queries
	pool *pgxpool.Pool
}

func (s *Service) findMany(ctx context.Context, ids []string) ([]dto.Diary, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	dbDiaries, err := s.Db.Queries.GetDiaries(ctx, ids)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get diary entries")
	}

	diaries := make([]dto.Diary, len(dbDiaries))

	for i, dbDiary := range dbDiaries {
		res, err := mapper.ToDiary(dbDiary)

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to get diary entries")
		}

		diaries[i] = res
	}

	return diaries, nil
}

func (s *Service) find(ctx context.Context, id string) (*dto.Diary, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.findMany(ctx, []string{id})

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	if len(res) != 1 {
		err = huma.Error404NotFound("Diary entry not found")
		sp.RecordError(err)
		return nil, err
	}

	return &res[0], nil
}

func (s *Service) create(ctx context.Context, body dto.CreateDiaryInputBody) (*dto.CreateDiaryOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	dbDiary, err := s.db.CreateNewDiary(ctx, db.CreateNewDiaryParams{
		ID:               uid.Flake(),
		UserID:           userId,
		Title:            body.Title,
		Description:      "",
		ShareWithFriends: false,
		Date: pgtype.Timestamptz{
			Time:  body.Date,
			Valid: true,
		},
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create diary")
	}

	diary, err := s.find(ctx, dbDiary.ID)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get diary")
	}

	return &dto.CreateDiaryOutput{
		Body: dto.CreateDiaryOutputBody{
			Diary: *diary,
		},
	}, nil
}

func (s *Service) get(ctx context.Context, id string) (*dto.GetDiaryByIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	diary, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	if !canRead(diary, userId) {
		err = huma.Error403Forbidden("You are not authorized to access this diary")
		sp.RecordError(err)
		return nil, err
	}

	return &dto.GetDiaryByIdOutput{
		Body: dto.GetDiaryByIdOutputBody{
			Diary: *diary,
		},
	}, nil
}

func (s *Service) list(ctx context.Context, params dto.PaginationQueryParams, filterParams dto.DiaryDateFilterQueryParams) (*dto.GetDiariesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	if filterParams.From != "" && filterParams.To != "" {
		return s.filterAndList(ctx, params, filterParams)
	}

	return s.listAll(ctx, params)
}

func (s *Service) listAll(ctx context.Context, params dto.PaginationQueryParams) (*dto.GetDiariesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	dbRes, err := s.Db.Queries.ListDiaries(ctx, db.ListDiariesParams{
		UserID: userId,
		Offset: int32(pagination.GetOffset(params)),
		Limit:  int32(params.PageSize),
	})

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("Diaries not found")
		}

		return nil, err
	}

	ids := make([]string, len(dbRes))

	for i, v := range dbRes {
		ids[i] = v.ID
	}

	diaries, err := s.findMany(ctx, ids)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	count, err := s.Db.Queries.CountDiaries(ctx, userId)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.GetDiariesOutput{
		Body: dto.GetDiariesOutputBody{
			Diaries:    diaries,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) filterAndList(ctx context.Context, params dto.PaginationQueryParams, filterParams dto.DiaryDateFilterQueryParams) (*dto.GetDiariesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	to, err := time.Parse(time.DateOnly, filterParams.To)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error422UnprocessableEntity("Invalid date format parameter: to")
	}

	from, err := time.Parse(time.DateOnly, filterParams.From)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error422UnprocessableEntity("Invalid date format parameter: from")
	}

	userId := ctx.Value("userId").(string)

	dbRes, err := s.Db.Queries.ListAndFilterDiaries(ctx, db.ListAndFilterDiariesParams{
		UserID: userId,
		Offset: int32(pagination.GetOffset(params)),
		Limit:  int32(params.PageSize),
		Date:   pgtype.Timestamptz{Time: to, Valid: true},
		Date_2: pgtype.Timestamptz{Time: from, Valid: true},
	})

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("Diaries not found")
		}

		return nil, err
	}

	ids := make([]string, len(dbRes))

	for i, v := range dbRes {
		ids[i] = v.ID
	}

	res, err := s.findMany(ctx, ids)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	count, err := s.Db.Queries.CountDiariesFilterByRange(ctx, db.CountDiariesFilterByRangeParams{
		UserID: userId,
		Date:   pgtype.Timestamptz{Time: to, Valid: true},
		Date_2: pgtype.Timestamptz{Time: from, Valid: true},
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to count diaries")
	}

	return &dto.GetDiariesOutput{
		Body: dto.GetDiariesOutputBody{
			Diaries:    res,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) remove(ctx context.Context, id string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	diary, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	userId := ctx.Value("userId").(string)

	if !canDelete(diary, userId) {
		err = huma.Error403Forbidden("You are not authorized to delete this diary")
		sp.RecordError(err)
		return err
	}

	err = s.Db.Queries.DeleteDiary(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to delete diary entry")
	}

	for _, m := range diary.Images {
		bucket, err := storage.OpenBucket(ctx, storage.BUCKET_DIARIES)

		if err != nil {
			tracing.Slog.Error("error deleting diary image. cannot open bucket", slog.Any("error", err))
			continue
		}

		err = bucket.Delete(ctx, m.Url)

		if err != nil {
			tracing.Slog.Error("error deleting diary image. cannot remove object from bucket", slog.Any("error", err))
			continue
		}
	}

	return nil
}

func (s *Service) uploadImage(ctx context.Context, id string, body dto.UploadDiaryImageInputBody) (*dto.UploadDiaryImageOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	diary, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	if !isOwner(diary, userId) {
		err = huma.Error403Forbidden("You are not authorized to upload media for this diary")
		sp.RecordError(err)
		return nil, err
	}

	// Check if the file is uploaded
	ok := storage.FileExists(ctx, storage.BUCKET_DIARIES, body.FileName)

	if !ok {
		err = huma.Error400BadRequest("File not uploaded")
		sp.RecordError(err)
		return nil, err
	}

	// Check if user uploaded the correct file using cached information
	if !s.Cache.Has(ctx, cache.KeyBuilder(cache.KeyImageUpload, body.ID)) {
		err = huma.Error400BadRequest("Incorrect file")
		sp.RecordError(err)
		return nil, err
	}

	// delete cached information
	err = s.Cache.Del(ctx, cache.KeyBuilder(cache.KeyImageUpload, body.ID)).Err()

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to delete cached information")
	}

	url, err := storage.GetUrl(ctx, storage.BUCKET_DIARIES, body.FileName)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get url")
	}

	lastOrder, err := s.Db.Queries.GetDiaryLastImageIndex(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get last media order")
	}

	ord, ok := lastOrder.(int32)

	if !ok {
		err = huma.Error500InternalServerError("Failed to cast last media order")
		sp.RecordError(err)
		return nil, err
	}

	order, err := utils.SafeInt32ToInt16(ord)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Internal server error")
	}

	order++

	_, err = s.Db.Queries.CreateDiaryImage(ctx, db.CreateDiaryImageParams{
		DiaryID: id,
		Url:     url,
		Index:   order,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create diary media")
	}

	diary, err = s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.UploadDiaryImageOutput{
		Body: dto.UploadDiaryImageOutputBody{
			Diary: *diary,
		},
	}, nil
}

func (s *Service) removeImage(ctx context.Context, id string, mediaId int64) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	diary, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	userId := ctx.Value("userId").(string)

	if !isOwner(diary, userId) {
		err = huma.Error403Forbidden("You are not authorized to delete this diary")
		sp.RecordError(err)
		return err
	}

	tx, err := s.pool.Begin(ctx)

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to start transaction")
	}

	defer tx.Rollback(ctx)

	qtx := s.Db.Queries.WithTx(tx)

	err = qtx.RemoveDiaryAllImages(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to delete diary images")
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
			DiaryID: id,
			Url:     m.Url,
			Index:   index + 1,
		})

		if err != nil {
			sp.RecordError(err)
			return huma.Error500InternalServerError("Failed to create diary entry media")
		}

		index++
	}

	err = tx.Commit(ctx)

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to commit transaction")
	}

	if toBeRemoved != nil {
		filename := storage.GetFilename(ctx, toBeRemoved.Url)
		bucket, err := storage.OpenBucket(ctx, storage.BUCKET_DIARIES)

		if err != nil {
			s.Log.Error("Diary media removal failed.", zap.String("url", toBeRemoved.Url), zap.Error(err))
			return nil
		}

		defer bucket.Close()

		err = bucket.Delete(ctx, filename)

		if err != nil {
			s.Log.Error("Diary media removal failed.", zap.String("url", toBeRemoved.Url), zap.Error(err))
			return nil
		}
	}

	return nil
}

func (s *Service) updateImage(ctx context.Context, id string, body dto.UpdateDiaryImageInputBody) (*dto.UpdateDiaryImageOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	diary, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	if !isOwner(diary, userId) {
		err = huma.Error403Forbidden("You are not authorized to update this diary")
		sp.RecordError(err)
		return nil, err
	}

	tx, err := s.pool.Begin(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to start transaction")
	}

	defer tx.Rollback(ctx)

	qtx := s.Db.Queries.WithTx(tx)

	err = qtx.RemoveDiaryAllImages(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to delete diary images")
	}

	images := diary.Images

	slices.SortFunc(images, func(a, b dto.DiaryImage) int {
		return int(a.Index) - int(b.Index)
	})

	for i, imageId := range body.Ids {
		var m *dto.DiaryImage = nil

		for _, v := range images {
			if v.ID == imageId {
				m = &v
				break
			}
		}

		if m == nil {
			err = huma.Error400BadRequest("Invalid image ID")
			sp.RecordError(err)
			return nil, err
		}

		index, err := utils.SafeInt64ToInt16(int64(i))

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Internal server error")
		}

		_, err = qtx.CreateDiaryImage(ctx, db.CreateDiaryImageParams{
			DiaryID: id,
			Url:     m.Url,
			Index:   index + 1,
		})

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to create diary entry image")
		}
	}

	err = tx.Commit(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to commit transaction")
	}

	diary, err = s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get diary")
	}

	return &dto.UpdateDiaryImageOutput{
		Body: dto.UpdateDiaryImageOutputBody{
			Diary: *diary,
		},
	}, nil
}

func (s *Service) update(ctx context.Context, id string, body dto.UpdateDiaryInputBody) (*dto.UpdateDiaryOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	diary, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	if !canUpdate(diary, userId) {
		err = huma.Error403Forbidden("You are not authorized to update this diary")
		sp.RecordError(err)
		return nil, err
	}

	_, err = s.db.UpdateDiary(ctx, db.UpdateDiaryParams{
		ID:          id,
		Title:       body.Title,
		Description: body.Description,
		Date: pgtype.Timestamptz{
			Time:  body.Date,
			Valid: true,
		},
		ShareWithFriends: body.ShareWithFriends,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update diary")
	}

	diary, err = s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get diary")
	}

	return &dto.UpdateDiaryOutput{
		Body: dto.UpdateDiaryOutputBody{
			Diary: *diary,
		},
	}, nil
}

func (s *Service) updateFriends(ctx context.Context, id string, body dto.UpdateDiaryFriendsInputBody) (*dto.UpdateDiaryFriendsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	diary, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	if !isOwner(diary, userId) {
		err = huma.Error403Forbidden("You are not authorized to update this diary")
		sp.RecordError(err)
		return nil, err
	}

	tx, err := s.pool.Begin(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to start transaction")
	}

	defer tx.Rollback(ctx)

	qtx := s.Db.Queries.WithTx(tx)

	err = qtx.RemoveDiaryFriends(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update diary friends")
	}

	batch := make([]db.BatchCreateDiaryUsersParams, len(body.Friends))

	for i, friendId := range body.Friends {
		index, err := utils.SafeInt64ToInt32(int64(i))

		if err != nil {
			return nil, huma.Error500InternalServerError("Internal server error")
		}

		batch[i] = db.BatchCreateDiaryUsersParams{
			DiaryID: id,
			UserID:  friendId,
			Index:   index + 1,
		}
	}

	_, err = qtx.BatchCreateDiaryUsers(ctx, batch)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to add diary friends")
	}

	err = tx.Commit(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to commit transaction")
	}

	diary, err = s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get diary")
	}

	return &dto.UpdateDiaryFriendsOutput{
		Body: dto.UpdateDiaryFriendsOutputBody{
			Diary: *diary,
		},
	}, nil
}

func (s *Service) updateLocations(ctx context.Context, id string, body dto.UpdateDiaryLocationsInputBody) (*dto.UpdateDiaryLocationsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	diary, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	if !isOwner(diary, userId) {
		err = huma.Error403Forbidden("You are not authorized to manage this diary")
		sp.RecordError(err)
		return nil, err
	}

	tx, err := s.pool.Begin(ctx)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to start transaction")
	}

	defer tx.Rollback(ctx)

	qtx := s.Db.Queries.WithTx(tx)

	err = qtx.RemoveDiaryLocations(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update diary locations")
	}

	batch := make([]db.BatchCreateDiaryLocationsParams, len(body.Locations))

	for i, location := range body.Locations {
		var description *string = nil

		if location.Description != nil {
			description = location.Description
		}

		index, err := utils.SafeInt64ToInt32(int64(i))

		if err != nil {
			return nil, huma.Error500InternalServerError("Internal server error")
		}

		batch[i] = db.BatchCreateDiaryLocationsParams{
			DiaryID: id,
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
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update diary locations")
	}

	err = tx.Commit(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to commit transaction")
	}

	diary, err = s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get diary")
	}

	return &dto.UpdateDiaryLocationsOutput{
		Body: dto.UpdateDiaryLocationsOutputBody{
			Diary: *diary,
		},
	}, nil
}
