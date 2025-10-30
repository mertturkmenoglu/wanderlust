package reports

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"time"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mail"
	"wanderlust/pkg/mapper"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/uid"
	"wanderlust/pkg/utils"

	sq "github.com/Masterminds/squirrel"
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

	user, err := s.db.GetUserById(ctx, userId)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get user")
	}

	dbRes, err := s.db.CreateReport(ctx, db.CreateReportParams{
		ID:           uid.Flake(),
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

	err = s.Mail.Send(mail.MailInfo{
		TemplatePath: "templates/report-acknowledge.html",
		Subject:      "We receieved your report!",
		To:           user.Email,
		Data:         mail.ReportAcknowledgeEmailPayload{},
	})

	if err != nil {
		sp.RecordError(err)
		tracing.Slog.Error("Failed to send report acknowledge email",
			slog.String("reportId", report.ID),
			slog.Any("error", err),
		)
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

func (s *Service) findByQuery(ctx context.Context, input *dto.SearchReportsInput) ([]dto.Report, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	psql := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)

	builder := psql.Select("*").From("reports")

	if input.ReporterID != "" {
		builder = builder.Where(sq.Eq{"reporter_id": input.ReporterID})
	}

	if input.ResourceType != "" {
		builder = builder.Where(sq.Eq{"resource_type": input.ResourceType})
	}

	if input.Reason != 0 {
		builder = builder.Where(sq.Eq{"reason": input.Reason})
	}

	if !input.Resolved {
		builder = builder.Where(sq.Eq{"resolved": input.Resolved})
	}

	offset, err := utils.SafeInt32ToUInt64(pagination.GetOffset(input.PaginationQueryParams))

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Internal server error")
	}

	limit, err := utils.SafeInt32ToUInt64(input.PaginationQueryParams.PageSize)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Internal server error")
	}

	builder = builder.Offset(offset)
	builder = builder.Limit(limit)
	builder = builder.OrderBy("created_at DESC")

	query, args, err := builder.ToSql()

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to build query")
	}

	rows, err := s.pool.Query(ctx, query, args...)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to query database")
	}

	defer rows.Close()

	var items []db.Report

	for rows.Next() {
		var i db.Report

		err := rows.Scan(
			&i.ID,
			&i.ResourceID,
			&i.ResourceType,
			&i.ReporterID,
			&i.Description,
			&i.Reason,
			&i.Resolved,
			&i.ResolvedAt,
			&i.CreatedAt,
			&i.UpdatedAt,
		)

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to scan row")
		}

		items = append(items, i)
	}

	if err := rows.Err(); err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to scan rows")
	}

	reports := make([]dto.Report, len(items))

	for i, r := range items {
		reports[i] = mapper.ToReport(r)
	}

	return reports, nil
}

func (s *Service) countByQuery(ctx context.Context, input *dto.SearchReportsInput) (int64, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	psql := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)

	builder := psql.Select("COUNT(*)").From("reports")

	if input.ReporterID != "" {
		builder = builder.Where(sq.Eq{"reporter_id": input.ReporterID})
	}

	if input.ResourceType != "" {
		builder = builder.Where(sq.Eq{"resource_type": input.ResourceType})
	}

	if input.Reason != 0 {
		builder = builder.Where(sq.Eq{"reason": input.Reason})
	}

	if !input.Resolved {
		builder = builder.Where(sq.Eq{"resolved": input.Resolved})
	}

	query, args, err := builder.ToSql()

	if err != nil {
		sp.RecordError(err)
		return 0, huma.Error500InternalServerError("Failed to build query")
	}

	row := s.pool.QueryRow(ctx, query, args...)

	var count int64

	err = row.Scan(&count)

	if err != nil {
		sp.RecordError(err)
		return 0, huma.Error500InternalServerError("Failed to scan row")
	}

	return count, nil
}

func (s *Service) search(ctx context.Context, input *dto.SearchReportsInput) (*dto.SearchReportsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	reports, err := s.findByQuery(ctx, input)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	count, err := s.countByQuery(ctx, input)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &dto.SearchReportsOutput{
		Body: dto.SearchReportsOutputBody{
			Reports:    reports,
			Pagination: pagination.Compute(input.PaginationQueryParams, count),
		},
	}, nil
}
