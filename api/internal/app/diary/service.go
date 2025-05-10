package diary

import (
	"context"
	"errors"
	"time"
	"wanderlust/internal/pkg/core"
	"wanderlust/internal/pkg/db"
	"wanderlust/internal/pkg/dto"
	"wanderlust/internal/pkg/mapper"
	"wanderlust/internal/pkg/pagination"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
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
	if filterParams.From != nil && filterParams.To != nil {
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
	to, err := time.Parse(time.RFC3339, *filterParams.To)

	if err != nil {
		return nil, huma.Error422UnprocessableEntity("invalid date format parameter to")
	}

	from, err := time.Parse(time.RFC3339, *filterParams.From)

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
