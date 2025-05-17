package diary

import (
	"context"
	"errors"
	"strings"
	"time"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/upload"
	"wanderlust/pkg/utils"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/minio/minio-go/v7"
	"go.uber.org/zap"
)

type Service struct {
	app *core.Application
}

func (s *Service) getMany(ids []string) ([]dto.DiaryEntry, error) {
	res, err := s.app.Db.Queries.GetDiaryEntriesByIdsPopulated(context.Background(), ids)

	if err != nil {
		return nil, err
	}

	entries := make([]dto.DiaryEntry, len(res))

	for i, r := range res {
		v, err := mapper.ToDiaryEntry(r)

		if err != nil {
			return nil, err
		}

		entries[i] = v
	}

	return entries, nil
}

func (s *Service) getById(userId string, id string) (*dto.GetDiaryEntryByIdOutput, error) {
	res, err := s.get(id)

	if err != nil {
		return nil, err
	}

	if res.UserID != userId {
		if !res.ShareWithFriends {
			return nil, huma.Error403Forbidden("You are not authorized to access this diary entry")
		}

		hasAccess := false

		for _, friend := range res.Friends {
			if friend.ID == userId {
				hasAccess = true
				break
			}
		}

		if !hasAccess {
			return nil, huma.Error403Forbidden("You are not authorized to access this diary entry")
		}
	}

	return &dto.GetDiaryEntryByIdOutput{
		Body: dto.GetDiaryEntryByIdOutputBody{
			Entry: *res,
		},
	}, nil
}

func (s *Service) get(id string) (*dto.DiaryEntry, error) {
	res, err := s.getMany([]string{id})

	if err != nil {
		return nil, err
	}

	if len(res) == 0 {
		return nil, huma.Error404NotFound("Diary entry not found")
	}

	return &res[0], nil
}

func (s *Service) changeSharing(userId string, id string) error {
	res, err := s.get(id)

	if err != nil {
		return err
	}

	if res.UserID != userId {
		return huma.Error403Forbidden("You are not authorized to access this diary entry")
	}

	err = s.app.Db.Queries.ChangeShareWithFriends(context.Background(), id)

	if err != nil {
		return huma.Error500InternalServerError("failed to change diary entry sharing")
	}

	return nil
}

func (s *Service) list(userId string, params dto.PaginationQueryParams, filterParams dto.DiaryDateFilterQueryParams) (*dto.GetDiaryEntriesOutput, error) {
	if filterParams.From != "" && filterParams.To != "" {
		return s.filterAndList(userId, params, filterParams)
	}

	return s.listAll(userId, params)
}

func (s *Service) listAll(userId string, params dto.PaginationQueryParams) (*dto.GetDiaryEntriesOutput, error) {
	dbRes, err := s.app.Db.Queries.ListDiaryEntries(context.Background(), db.ListDiaryEntriesParams{
		UserID: userId,
		Offset: int32(pagination.GetOffset(params)),
		Limit:  int32(params.PageSize),
	})

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("Diary entries not found")
		}

		return nil, err
	}

	ids := make([]string, len(dbRes))

	for i, v := range dbRes {
		ids[i] = v.ID
	}

	res, err := s.getMany(ids)

	if err != nil {
		return nil, err
	}

	count, err := s.app.Db.Queries.CountDiaryEntries(context.Background(), userId)

	if err != nil {
		return nil, err
	}

	return &dto.GetDiaryEntriesOutput{
		Body: dto.GetDiaryEntriesOutputBody{
			Entries:    res,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) filterAndList(userId string, params dto.PaginationQueryParams, filterParams dto.DiaryDateFilterQueryParams) (*dto.GetDiaryEntriesOutput, error) {
	to, err := time.Parse(time.DateOnly, filterParams.To)

	if err != nil {
		return nil, huma.Error422UnprocessableEntity("invalid date format parameter to")
	}

	from, err := time.Parse(time.DateOnly, filterParams.From)

	if err != nil {
		return nil, huma.Error422UnprocessableEntity("invalid date format parameter from")
	}

	dbRes, err := s.app.Db.Queries.ListAndFilterDiaryEntries(context.Background(), db.ListAndFilterDiaryEntriesParams{
		UserID: userId,
		Offset: int32(pagination.GetOffset(params)),
		Limit:  int32(params.PageSize),
		Date:   pgtype.Timestamptz{Time: to, Valid: true},
		Date_2: pgtype.Timestamptz{Time: from, Valid: true},
	})

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound("Diary entries not found")
		}

		return nil, err
	}

	ids := make([]string, len(dbRes))

	for i, v := range dbRes {
		ids[i] = v.ID
	}

	res, err := s.getMany(ids)

	if err != nil {
		return nil, err
	}

	count, err := s.app.Db.Queries.CountDiaryEntriesFilterByRange(context.Background(), db.CountDiaryEntriesFilterByRangeParams{
		UserID: userId,
		Date:   pgtype.Timestamptz{Time: to, Valid: true},
		Date_2: pgtype.Timestamptz{Time: from, Valid: true},
	})

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to count diary entries")
	}

	return &dto.GetDiaryEntriesOutput{
		Body: dto.GetDiaryEntriesOutputBody{
			Entries:    res,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) create(userId string, body dto.CreateDiaryEntryInputBody) (*dto.CreateDiaryEntryOutput, error) {
	t, err := time.Parse(time.DateOnly, body.Date)

	if err != nil {
		return nil, huma.Error422UnprocessableEntity("invalid date format")
	}

	ctx := context.Background()
	tx, err := s.app.Db.Pool.Begin(ctx)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to create diary entry")
	}

	defer tx.Rollback(ctx)

	qtx := s.app.Db.Queries.WithTx(tx)

	entry, err := qtx.CreateNewDiaryEntry(ctx, db.CreateNewDiaryEntryParams{
		ID:               utils.GenerateId(s.app.Flake),
		UserID:           userId,
		Title:            body.Title,
		Description:      body.Description,
		ShareWithFriends: body.ShareWithFriends,
		Date:             pgtype.Timestamptz{Time: t, Valid: true},
	})

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to create diary entry")
	}

	for i, poi := range body.Locations {
		_, err = qtx.CreateDiaryEntryPoi(ctx, db.CreateDiaryEntryPoiParams{
			DiaryEntryID: entry.ID,
			PoiID:        poi.ID,
			Description:  utils.NilStrToText(poi.Description),
			ListIndex:    int32(i + 1),
		})

		if err != nil {
			return nil, huma.Error500InternalServerError("failed to create diary entry poi")
		}
	}

	for i, friendID := range body.Friends {
		_, err = qtx.CreateDiaryEntryUser(ctx, db.CreateDiaryEntryUserParams{
			DiaryEntryID: entry.ID,
			UserID:       friendID,
			ListIndex:    int32(i + 1),
		})

		if err != nil {
			return nil, huma.Error500InternalServerError("failed to create diary entry user")
		}
	}

	err = tx.Commit(ctx)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to create diary entry")
	}

	entryRes, err := s.get(entry.ID)

	if err != nil {
		return nil, huma.Error500InternalServerError("failed to get diary entry")
	}

	return &dto.CreateDiaryEntryOutput{
		Body: dto.CreateDiaryEntryOutputBody{
			Entry: *entryRes,
		},
	}, nil
}

func (s *Service) remove(userId string, id string) error {
	entry, err := s.get(id)

	if err != nil {
		return err
	}

	if entry.UserID != userId {
		return huma.Error403Forbidden("you are not authorized to delete this diary entry")
	}

	err = s.app.Db.Queries.DeleteDiaryEntry(context.Background(), id)

	if err != nil {
		return huma.Error500InternalServerError("failed to delete diary entry")
	}

	bucket := upload.BUCKET_DIARIES

	for _, m := range entry.Media {
		_, after, found := strings.Cut(m.Url, "diaries/")

		if !found {
			continue
		}

		err = s.app.Upload.Client.RemoveObject(
			context.Background(),
			string(bucket),
			after,
			minio.RemoveObjectOptions{},
		)

		if err != nil {
			s.app.Log.Debug("error deleting diary media, cannot remove object from bucket",
				zap.String("bucket", string(bucket)),
				zap.String("object", after),
				zap.String("url", m.Url),
				zap.Error(err),
			)
			continue
		}
	}

	return nil
}

func (s *Service) uploadMedia(userId string, id string, body dto.UploadDiaryMediaInputBody) (*dto.UploadDiaryMediaOutput, error) {
	entry, err := s.get(id)

	if err != nil {
		return nil, err
	}

	if entry.UserID != userId {
		return nil, huma.Error403Forbidden("you are not authorized to upload media for this diary entry")
	}

	bucket := upload.BUCKET_DIARIES

	// Check if the file is uploaded
	_, err = s.app.Upload.Client.GetObject(
		context.Background(),
		string(bucket),
		body.FileName,
		minio.GetObjectOptions{},
	)

	if err != nil {
		return nil, huma.Error400BadRequest("file not uploaded")
	}

	// Check if user uploaded the correct file using cached information
	if !s.app.Cache.Has(cache.KeyBuilder(cache.KeyImageUpload, userId, body.ID)) {
		return nil, huma.Error400BadRequest("incorrect file")
	}

	// delete cached information
	err = s.app.Cache.Del(cache.KeyBuilder(cache.KeyImageUpload, userId, body.ID))

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to delete cached information")
	}

	endpoint := s.app.Upload.Client.EndpointURL().String()
	url := endpoint + "/" + string(bucket) + "/" + body.FileName

	lastOrder, err := s.app.Db.Queries.GetLastMediaOrderOfEntry(context.Background(), id)

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to get last media order")
	}

	ord, ok := lastOrder.(int32)

	if !ok {
		return nil, huma.Error500InternalServerError("Failed to cast last media order")
	}

	order := int16(ord) + 1

	_, err = s.app.Db.Queries.CreateDiaryMedia(context.Background(), db.CreateDiaryMediaParams{
		DiaryEntryID: id,
		Url:          url,
		Alt:          body.FileName,
		Caption:      utils.StrToText(body.FileName),
		MediaOrder:   order,
	})

	if err != nil {
		return nil, huma.Error500InternalServerError("Failed to create diary media")
	}

	entryRes, err := s.get(id)

	if err != nil {
		return nil, err
	}

	return &dto.UploadDiaryMediaOutput{
		Body: dto.UploadDiaryMediaOutputBody{
			Entry: *entryRes,
		},
	}, nil
}
