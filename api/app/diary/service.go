package diary

import (
	"context"
	"errors"
	"slices"
	"strings"
	"time"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/upload"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/minio/minio-go/v7"
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

	dbEntries, err := s.Db.Queries.GetDiaries(ctx, ids)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	entries := make([]dto.Diary, len(dbEntries))

	for i, dbEntry := range dbEntries {
		entry, err := mapper.ToDiaryEntry(dbEntry)

		if err != nil {
			sp.RecordError(err)
			return nil, err
		}

		entries[i] = entry
	}

	return entries, nil
}

func (s *Service) findById(ctx context.Context, id string) (*dto.DiaryEntry, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	entries, err := s.findMany(ctx, []string{id})

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	if len(entries) == 0 {
		err = huma.Error404NotFound("Diary entry not found")
		sp.RecordError(err)
		return nil, err
	}

	return &entries[0], nil
}

func (s *Service) create(ctx context.Context, body dto.CreateDiaryEntryInputBody) (*dto.CreateDiaryEntryOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	dbEntry, err := s.db.CreateNewDiary(ctx, db.CreateNewDiaryParams{
		ID:               s.ID.Flake(),
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
		return nil, huma.Error500InternalServerError("Failed to create diary entry")
	}

	entry, err := s.findById(ctx, dbEntry.ID)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get diary entry")
	}

	return &dto.CreateDiaryEntryOutput{
		Body: dto.CreateDiaryEntryOutputBody{
			Entry: *entry,
		},
	}, nil
}

func (s *Service) get(ctx context.Context, id string) (*dto.GetDiaryEntryByIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	entry, err := s.findById(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	if !canRead(entry, userId) {
		err = huma.Error403Forbidden("You are not authorized to access this diary entry")
		sp.RecordError(err)
		return nil, err
	}

	return &dto.GetDiaryEntryByIdOutput{
		Body: dto.GetDiaryEntryByIdOutputBody{
			Entry: *entry,
		},
	}, nil
}

func (s *Service) list(ctx context.Context, params dto.PaginationQueryParams, filterParams dto.DiaryDateFilterQueryParams) (*dto.GetDiaryEntriesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	if filterParams.From != "" && filterParams.To != "" {
		return s.filterAndList(ctx, params, filterParams)
	}

	return s.listAll(ctx, params)
}

func (s *Service) listAll(ctx context.Context, params dto.PaginationQueryParams) (*dto.GetDiaryEntriesOutput, error) {
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
			return nil, huma.Error404NotFound("Diary entries not found")
		}

		return nil, err
	}

	ids := make([]string, len(dbRes))

	for i, v := range dbRes {
		ids[i] = v.ID
	}

	entries, err := s.findMany(ctx, ids)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	count, err := s.Db.Queries.CountDiaries(ctx, userId)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.GetDiaryEntriesOutput{
		Body: dto.GetDiariesOutputBody{
			Entries:    entries,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) filterAndList(ctx context.Context, params dto.PaginationQueryParams, filterParams dto.DiaryDateFilterQueryParams) (*dto.GetDiaryEntriesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	to, err := time.Parse(time.DateOnly, filterParams.To)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error422UnprocessableEntity("invalid date format parameter to")
	}

	from, err := time.Parse(time.DateOnly, filterParams.From)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error422UnprocessableEntity("invalid date format parameter from")
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
			return nil, huma.Error404NotFound("Diary entries not found")
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
		return nil, huma.Error500InternalServerError("failed to count diary entries")
	}

	return &dto.GetDiaryEntriesOutput{
		Body: dto.GetDiariesOutputBody{
			Entries:    res,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) remove(ctx context.Context, id string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	entry, err := s.findById(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	userId := ctx.Value("userId").(string)

	if !canDelete(entry, userId) {
		err = huma.Error403Forbidden("you are not authorized to delete this diary entry")
		sp.RecordError(err)
		return err
	}

	err = s.Db.Queries.DeleteDiary(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("failed to delete diary entry")
	}

	bucket := string(upload.BUCKET_DIARIES)

	for _, m := range entry.Media {
		_, after, found := strings.Cut(m.Url, "diaries/")

		if !found {
			continue
		}

		err = s.Upload.Client.RemoveObject(ctx, bucket, after, minio.RemoveObjectOptions{})

		if err != nil {
			s.Log.Debug("error deleting diary media, cannot remove object from bucket",
				zap.String("bucket", bucket),
				zap.String("object", after),
				zap.String("url", m.Url),
				zap.Error(err),
			)
			continue
		}
	}

	return nil
}

func (s *Service) uploadMedia(ctx context.Context, id string, body dto.UploadDiaryMediaInputBody) (*dto.UploadDiaryMediaOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	entry, err := s.findById(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	if entry.UserID != userId {
		err = huma.Error403Forbidden("You are not authorized to upload media for this diary entry")
		sp.RecordError(err)
		return nil, err
	}

	bucket := string(upload.BUCKET_DIARIES)

	// Check if the file is uploaded
	_, err = s.Upload.Client.GetObject(ctx, bucket, body.FileName, minio.GetObjectOptions{})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error400BadRequest("File not uploaded")
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

	endpoint := s.Upload.Client.EndpointURL().String()
	url := endpoint + "/" + string(bucket) + "/" + body.FileName

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

	order := int16(ord) + 1

	_, err = s.Db.Queries.CreateDiaryImage(ctx, db.CreateDiaryImageParams{
		DiaryID: id,
		Url:     url,
		Index:   order,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create diary media")
	}

	entryRes, err := s.findById(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.UploadDiaryMediaOutput{
		Body: dto.UploadDiaryMediaOutputBody{
			Entry: *entryRes,
		},
	}, nil
}

func (s *Service) removeMedia(ctx context.Context, id string, mediaId int64) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	entry, err := s.findById(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	userId := ctx.Value("userId").(string)

	if entry.UserID != userId {
		err = huma.Error403Forbidden("You are not authorized to delete this diary entry")
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
		return huma.Error500InternalServerError("Failed to delete diary entry media")
	}

	media := entry.Media

	slices.SortFunc(media, func(a, b dto.DiaryMedia) int {
		return int(a.MediaOrder) - int(b.MediaOrder)
	})

	index := 0

	var toBeRemoved *dto.DiaryMedia = nil

	for _, m := range media {
		if m.ID == mediaId {
			toBeRemoved = &m
			continue
		}

		_, err = qtx.CreateDiaryImage(ctx, db.CreateDiaryImageParams{
			DiaryID: id,
			Url:     m.Url,
			Index:   int16(index + 1),
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
		err = s.Upload.RemoveFileFromUrl(toBeRemoved.Url, upload.BUCKET_DIARIES)

		if err != nil {
			s.Log.Error("Diary media removal failed.", zap.String("url", toBeRemoved.Url), zap.Error(err))
		}
	}

	return nil
}

func (s *Service) updateMedia(ctx context.Context, id string, body dto.UpdateDiaryMediaInputBody) (*dto.UpdateDiaryMediaOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	entry, err := s.findById(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	if entry.UserID != userId {
		err = huma.Error403Forbidden("You are not authorized to update this diary entry")
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
		return nil, huma.Error500InternalServerError("Failed to delete diary entry media")
	}

	media := entry.Media

	slices.SortFunc(media, func(a, b dto.DiaryMedia) int {
		return int(a.MediaOrder) - int(b.MediaOrder)
	})

	for i, id := range body.Ids {
		var m *dto.DiaryMedia = nil

		for _, v := range media {
			if v.ID == id {
				m = &v
				break
			}
		}

		if m == nil {
			err = huma.Error400BadRequest("Invalid media ID")
			sp.RecordError(err)
			return nil, err
		}

		var cap string = ""

		if m.Caption != nil {
			cap = *m.Caption
		}

		_, err = qtx.CreateDiaryImage(ctx, db.CreateDiaryImageParams{
			DiaryEntryID: m.DiaryEntryID,
			Url:          m.Url,
			Alt:          m.Alt,
			Caption: pgtype.Text{
				String: cap,
				Valid:  m.Caption != nil,
			},
			MediaOrder: int16(i + 1),
		})

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to create diary entry media")
		}
	}

	err = tx.Commit(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to commit transaction")
	}

	entry, err = s.findById(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get diary entry")
	}

	return &dto.UpdateDiaryMediaOutput{
		Body: dto.UpdateDiaryMediaOutputBody{
			Entry: *entry,
		},
	}, nil
}

func (s *Service) update(ctx context.Context, id string, body dto.UpdateDiaryEntryInputBody) (*dto.UpdateDiaryEntryOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	entry, err := s.findById(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	if !canUpdate(entry, userId) {
		err = huma.Error403Forbidden("you are not authorized to update this diary entry")
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

	_, err = qtx.UpdateDiaryEntry(ctx, db.UpdateDiaryEntryParams{
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
		return nil, huma.Error500InternalServerError("Failed to update diary entry")
	}

	err = tx.Commit(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to commit transaction")
	}

	entry, err = s.findById(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get diary entry")
	}

	return &dto.UpdateDiaryEntryOutput{
		Body: dto.UpdateDiaryEntryOutputBody{
			Entry: *entry,
		},
	}, nil
}

func (s *Service) updateFriends(ctx context.Context, id string, body dto.UpdateDiaryFriendsInputBody) (*dto.UpdateDiaryFriendsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	entry, err := s.findById(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	if entry.UserID != userId {
		err = huma.Error403Forbidden("You are not authorized to update this diary entry")
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

	err = qtx.RemoveDiaryEntryFriends(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update diary entry friends")
	}

	batch := make([]db.BatchCreateDiaryEntryUsersParams, len(body.Friends))

	for i, friendId := range body.Friends {
		batch[i] = db.BatchCreateDiaryEntryUsersParams{
			DiaryEntryID: id,
			UserID:       friendId,
			ListIndex:    int32(i + 1),
		}
	}

	_, err = qtx.BatchCreateDiaryEntryUsers(ctx, batch)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to add diary entry friends")
	}

	err = tx.Commit(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to commit transaction")
	}

	entry, err = s.findById(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get diary entry")
	}

	return &dto.UpdateDiaryFriendsOutput{
		Body: dto.UpdateDiaryFriendsOutputBody{
			Entry: *entry,
		},
	}, nil
}

func (s *Service) updateLocations(ctx context.Context, id string, body dto.UpdateDiaryLocationsInputBody) (*dto.UpdateDiaryLocationsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	entry, err := s.findById(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	if entry.UserID != userId {
		err = huma.Error403Forbidden("You are not authorized to manage this diary entry")
		sp.RecordError(err)
		return nil, err
	}

	tx, err := s.pool.Begin(ctx)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to start transaction")
	}

	defer tx.Rollback(ctx)

	qtx := s.Db.Queries.WithTx(tx)

	err = qtx.RemoveDiaryEntryLocations(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update diary entry locations")
	}

	batch := make([]db.BatchCreateDiaryEntryLocationsParams, len(body.Locations))

	for i, location := range body.Locations {
		var description *string = nil

		if location.Description != nil {
			description = location.Description
		}

		batch[i] = db.BatchCreateDiaryEntryLocationsParams{
			DiaryEntryID: id,
			PoiID:        location.PoiID,
			ListIndex:    int32(i + 1),
			Description: pgtype.Text{
				String: *description,
				Valid:  description != nil,
			},
		}
	}

	_, err = qtx.BatchCreateDiaryEntryLocations(ctx, batch)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update diary entry locations")
	}

	err = tx.Commit(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to commit transaction")
	}

	entry, err = s.findById(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get diary entry")
	}

	return &dto.UpdateDiaryLocationsOutput{
		Body: dto.UpdateDiaryLocationsOutputBody{
			Entry: *entry,
		},
	}, nil
}
