package reports

import (
	"context"
	"errors"
	"fmt"
	"time"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
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

func (s *Service) list(ctx context.Context, params dto.PaginationQueryParams) (*dto.GetReportsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	reports, err := s.findPaginated(ctx, int32(pagination.GetOffset(params)), int32(params.PageSize))

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	count, err := s.db.CountReports(ctx)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get reports count")
	}

	return &dto.GetReportsOutput{
		Body: dto.GetReportsOutputBody{
			Reports:    reports,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) create(ctx context.Context, body dto.CreateReportInputBody) (*dto.CreateReportOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	dbRes, err := s.db.CreateReport(ctx, db.CreateReportParams{
		ID:           s.ID.Flake(),
		ResourceID:   body.ResourceID,
		ResourceType: body.ResourceType,
		Description:  pgtype.Text{String: body.Description, Valid: true},
		Reason:       body.Reason,
		ReporterID:   pgtype.Text{String: userId, Valid: true},
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create report")
	}

	report, err := s.find(ctx, dbRes.ID)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.CreateReportOutput{
		Body: dto.CreateReportOutputBody{
			Report: *report,
		},
	}, nil
}

func (s *Service) remove(ctx context.Context, id string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	_, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	err = s.db.DeleteReport(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return huma.Error500InternalServerError("Failed to delete report")
	}

	return nil
}

func (s *Service) update(ctx context.Context, id string, body dto.UpdateReportInputBody) (*dto.UpdateReportOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	_, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	err = s.db.UpdateReport(ctx, db.UpdateReportParams{
		ID:          id,
		Description: pgtype.Text{String: body.Description, Valid: true},
		Reason:      body.Reason,
		Resolved:    body.Resolved,
		ResolvedAt:  pgtype.Timestamptz{Time: time.Now(), Valid: body.Resolved},
		UpdatedAt:   pgtype.Timestamptz{Time: time.Now(), Valid: true},
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to update report")
	}

	report, err := s.find(ctx, id)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.UpdateReportOutput{
		Body: dto.UpdateReportOutputBody{
			Report: *report,
		},
	}, nil
}
