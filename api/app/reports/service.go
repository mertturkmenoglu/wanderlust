package reports

import (
	"context"
	"errors"
	"fmt"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Service struct {
	core.Application
	db   *db.Queries
	pool *pgxpool.Pool
}

func (s *Service) findPaginated(ctx context.Context, offset int32, limit int32) ([]dto.Report, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.db.GetReportsPaginated(ctx, db.GetReportsPaginatedParams{
		Offset: offset,
		Limit:  limit,
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get reports")
	}

	reports := make([]dto.Report, len(res))

	for i, r := range res {
		reports[i] = mapper.ToReport(r)
	}

	return reports, nil
}

func (s *Service) find(ctx context.Context, id string) (*dto.Report, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.db.GetReportById(ctx, id)

	if err != nil {
		sp.RecordError(err)

		if errors.Is(err, pgx.ErrNoRows) {
			return nil, huma.Error404NotFound(fmt.Sprintf("Report with ID: %s not found", id))
		}

		return nil, huma.Error500InternalServerError("Failed to get report")
	}

	report := mapper.ToReport(res)

	return &report, nil
}

func (s *Service) get(ctx context.Context, id string) (*dto.GetReportByIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	report, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}


	if !canRead(ctx, report) {
		return nil, huma.Error403Forbidden("You don't have permission to read this report")
	}

	return &dto.GetReportByIdOutput{
		Body: dto.GetReportByIdOutputBody{
			Report: *report,
		},
	}, nil
}
