package reports

import (
	"context"
	"log/slog"
	"time"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/mail"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/uid"

	"github.com/jackc/pgx/v5/pgtype"
)

type Service struct {
	repo *Repository
	mail *mail.MailService
}

func (s *Service) get(ctx context.Context, id string) (*GetReportByIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	report, err := s.repo.get(ctx, id)

	if err != nil {
		return nil, err
	}

	if !canRead(ctx, report) {
		return nil, ErrNotAuthorizedToRead
	}

	return &GetReportByIdOutput{
		Body: GetReportByIdOutputBody{
			Report: *report,
		},
	}, nil
}

func (s *Service) list(ctx context.Context, params dto.PaginationQueryParams) (*GetReportsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := s.repo.list(ctx, ListParams{
		Limit:  int32(params.PageSize),
		Offset: int32(pagination.GetOffset(params)),
	})

	if err != nil {
		return nil, err
	}

	count, err := s.repo.count(ctx)

	if err != nil {
		return nil, err
	}

	return &GetReportsOutput{
		Body: GetReportsOutputBody{
			Reports:    res,
			Pagination: pagination.Compute(params, count),
		},
	}, nil
}

func (s *Service) create(ctx context.Context, body CreateReportInputBody) (*CreateReportOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	userId := ctx.Value("userId").(string)

	user, err := s.repo.getUserById(ctx, userId)

	if err != nil {
		return nil, err
	}

	res, err := s.repo.create(ctx, CreateParams{
		ID:           uid.Flake(),
		ResourceID:   body.ResourceID,
		ResourceType: body.ResourceType,
		Description:  pgtype.Text{String: body.Description, Valid: true},
		Reason:       body.Reason,
		ReporterID:   pgtype.Text{String: userId, Valid: true},
	})

	if err != nil {
		return nil, err
	}

	err = s.mail.Send(mail.MailInfo{
		TemplatePath: "templates/report-acknowledge.html",
		Subject:      "We receieved your report!",
		To:           user.Email,
		Data:         mail.ReportAcknowledgeEmailPayload{},
	})

	if err != nil {
		sp.RecordError(err)
		tracing.Slog.Error("Failed to send report acknowledge email",
			slog.String("reportId", res.ID),
			slog.Any("error", err),
		)
	}

	return &CreateReportOutput{
		Body: CreateReportOutputBody{
			Report: dto.ToReport(*res),
		},
	}, nil
}

func (s *Service) remove(ctx context.Context, id string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	return s.repo.remove(ctx, id)
}

func (s *Service) update(ctx context.Context, id string, body UpdateReportInputBody) (*UpdateReportOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	err := s.repo.update(ctx, UpdateParams{
		ID: id,
		Description: pgtype.Text{
			String: body.Description,
			Valid:  true,
		},
		Reason:   body.Reason,
		Resolved: body.Resolved,
		ResolvedAt: pgtype.Timestamptz{
			Time:  time.Now(),
			Valid: body.Resolved,
		},
		UpdatedAt: pgtype.Timestamptz{
			Time:  time.Now(),
			Valid: true,
		},
	})

	if err != nil {
		return nil, err
	}

	report, err := s.repo.get(ctx, id)

	if err != nil {
		return nil, err
	}

	return &UpdateReportOutput{
		Body: UpdateReportOutputBody{
			Report: *report,
		},
	}, nil
}

func (s *Service) search(ctx context.Context, input *SearchReportsInput) (*SearchReportsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	reports, err := s.repo.findByQuery(ctx, input)

	if err != nil {
		return nil, err
	}

	count, err := s.repo.countByQuery(ctx, input)

	if err != nil {
		sp.RecordError(err)
		return nil, err
	}

	return &SearchReportsOutput{
		Body: SearchReportsOutputBody{
			Reports:    reports,
			Pagination: pagination.Compute(input.PaginationQueryParams, count),
		},
	}, nil
}
