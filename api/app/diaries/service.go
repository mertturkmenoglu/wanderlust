package diaries

import (
	"context"
	"log/slog"
	"time"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/storage"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/uid"

	"github.com/cockroachdb/errors"
	"github.com/jackc/pgx/v5/pgtype"
)

type Service struct {
	repo  *Repository
	cache *cache.Cache
}

func (s *Service) create(ctx context.Context, body dto.CreateDiaryInputBody) (*dto.CreateDiaryOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	dbDiary, err := s.repo.create(ctx, CreateParams{
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
		return nil, err
	}

	diary, err := s.repo.get(ctx, dbDiary.ID)

	if err != nil {
		return nil, err
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

	diary, err := s.repo.get(ctx, id)

	if err != nil {
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	if !canRead(diary, userId) {
		return nil, ErrNotAuthorized
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

	res, count, err := s.repo.listAll(ctx, userId, params)

	if err != nil {
		return nil, err
	}

	return &dto.GetDiariesOutput{
		Body: dto.GetDiariesOutputBody{
			Diaries:    res,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) filterAndList(ctx context.Context, params dto.PaginationQueryParams, filterParams dto.DiaryDateFilterQueryParams) (*dto.GetDiariesOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	to, err := time.Parse(time.DateOnly, filterParams.To)

	if err != nil {
		return nil, errors.Wrap(ErrInvalidDateFormatParameter, err.Error())
	}

	from, err := time.Parse(time.DateOnly, filterParams.From)

	if err != nil {
		return nil, errors.Wrap(ErrInvalidDateFormatParameter, err.Error())
	}

	userId := ctx.Value("userId").(string)

	res, count, err := s.repo.listByDateRange(ctx, userId, from, to, params)

	if err != nil {
		return nil, err
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

	diary, err := s.repo.get(ctx, id)

	if err != nil {
		return err
	}

	userId := ctx.Value("userId").(string)

	if !canDelete(diary, userId) {
		return ErrNotAuthorizedToDelete
	}

	err = s.repo.delete(ctx, id)

	if err != nil {
		return err
	}

	for _, m := range diary.Images {
		bucket, err := storage.OpenBucket(ctx, storage.BUCKET_DIARIES)

		if err != nil {
			tracing.Slog.Error("error deleting diary image. cannot open bucket", slog.Any("error", err))
			continue
		}

		defer bucket.Close()

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

	diary, err := s.repo.get(ctx, id)

	if err != nil {
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	if !isOwner(diary, userId) {
		return nil, ErrNotAuthorizedToUploadImage
	}

	// Check if the file is uploaded
	ok := storage.FileExists(ctx, storage.BUCKET_DIARIES, body.FileName)

	if !ok {
		return nil, errors.Wrap(ErrFailedToUploadImage, "file not found in storage")
	}

	// Check if user uploaded the correct file using cached information
	if !s.cache.Has(ctx, cache.KeyBuilder(cache.KeyImageUpload, body.ID)) {
		return nil, errors.Wrap(ErrFailedToUploadImage, "upload information not found or expired")
	}

	// delete cached information
	err = s.cache.Del(ctx, cache.KeyBuilder(cache.KeyImageUpload, body.ID)).Err()

	if err != nil {
		return nil, errors.Wrap(ErrFailedToUploadImage, err.Error())
	}

	url, err := storage.GetUrl(ctx, storage.BUCKET_DIARIES, body.FileName)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToUploadImage, err.Error())
	}

	err = s.repo.addImage(ctx, id, url)

	if err != nil {
		return nil, err
	}

	diary, err = s.repo.get(ctx, id)

	if err != nil {
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

	diary, err := s.repo.get(ctx, id)

	if err != nil {
		return err
	}

	userId := ctx.Value("userId").(string)

	if !isOwner(diary, userId) {
		return ErrNotAuthorizedToDeleteImage
	}

	err = s.repo.removeImage(ctx, diary, mediaId)

	if err != nil {
		return err
	}

	return nil
}

func (s *Service) updateImage(ctx context.Context, id string, body dto.UpdateDiaryImageInputBody) (*dto.UpdateDiaryImageOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	diary, err := s.repo.get(ctx, id)

	if err != nil {
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	if !isOwner(diary, userId) {
		return nil, ErrNotAuthorizedToUpdateImage
	}

	err = s.repo.updateImage(ctx, diary, body.Ids)

	if err != nil {
		return nil, err
	}

	diary, err = s.repo.get(ctx, id)

	if err != nil {
		return nil, err
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

	diary, err := s.repo.get(ctx, id)

	if err != nil {
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	if !canUpdate(diary, userId) {
		return nil, ErrNotAuthorizedToUpdate
	}

	err = s.repo.update(ctx, UpdateParams{
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
		return nil, err
	}

	diary, err = s.repo.get(ctx, id)

	if err != nil {
		return nil, err
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

	diary, err := s.repo.get(ctx, id)

	if err != nil {
		return nil, err
	}

	userId := ctx.Value("userId").(string)

	if !isOwner(diary, userId) {
		return nil, ErrNotAuthorizedToUpdateFriends
	}

	err = s.repo.updateFriends(ctx, diary, body.Friends)

	if err != nil {
		return nil, err
	}

	diary, err = s.repo.get(ctx, id)

	if err != nil {
		return nil, err
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

	diary, err := s.repo.get(ctx, id)

	if err != nil {
		return nil, err
	}

	if !isOwner(diary, userId) {
		return nil, ErrNotAuthorizedToUpdateLocations
	}

	err = s.repo.updateLocations(ctx, diary, body.Locations)

	if err != nil {
		return nil, err
	}

	diary, err = s.repo.get(ctx, id)

	if err != nil {
		return nil, err
	}

	return &dto.UpdateDiaryLocationsOutput{
		Body: dto.UpdateDiaryLocationsOutputBody{
			Diary: *diary,
		},
	}, nil
}
