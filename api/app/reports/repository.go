package reports

import (
	"context"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/pagination"
	"wanderlust/pkg/tracing"
	"wanderlust/pkg/utils"

	sq "github.com/Masterminds/squirrel"
	"github.com/cockroachdb/errors"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db   *db.Queries
	pool *pgxpool.Pool
}

type ListParams = db.FindManyReportsParams

func (r *Repository) list(ctx context.Context, params ListParams) ([]dto.Report, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.FindManyReports(ctx, params)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	reports := make([]dto.Report, len(res))

	for i, report := range res {
		reports[i] = dto.ToReport(report)
	}

	return reports, nil
}

func (r *Repository) get(ctx context.Context, id string) (*dto.Report, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.FindReportById(ctx, id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.Wrap(ErrNotFound, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToGet, err.Error())
	}

	report := dto.ToReport(res)

	return &report, nil
}

func (r *Repository) count(ctx context.Context) (int64, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	count, err := r.db.CountReports(ctx)

	if err != nil {
		return 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	return count, nil
}

func (r *Repository) getUserById(ctx context.Context, id string) (*db.User, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	user, err := r.db.FindUserById(ctx, id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.Wrap(ErrUserNotFound, err.Error())
		}

		return nil, errors.Wrap(ErrFailedToGetUser, err.Error())
	}

	return &user, nil
}

type CreateParams = db.CreateReportParams

func (r *Repository) create(ctx context.Context, params CreateParams) (*db.Report, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := r.db.CreateReport(ctx, params)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToCreate, err.Error())
	}

	return &res, nil
}

func (r *Repository) remove(ctx context.Context, id string) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tag, err := r.db.RemoveReportById(ctx, id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return errors.Wrap(ErrNotFound, err.Error())
		}

		return errors.Wrap(ErrFailedToDelete, err.Error())
	}

	if tag.RowsAffected() == 0 {
		return errors.Wrap(ErrNotFound, "no rows affected")
	}

	return nil
}

type UpdateParams = db.UpdateReportParams

func (r *Repository) update(ctx context.Context, params UpdateParams) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	tag, err := r.db.UpdateReport(ctx, params)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return errors.Wrap(ErrNotFound, err.Error())
		}

		return errors.Wrap(ErrFailedToUpdate, err.Error())
	}

	if tag.RowsAffected() == 0 {
		return errors.Wrap(ErrNotFound, "no rows affected")
	}

	return nil
}

type Query = SearchReportsInput

func (r *Repository) findByQuery(ctx context.Context, query *Query) ([]dto.Report, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	offset, err := utils.SafeInt32ToUInt64(pagination.GetOffset(query.PaginationQueryParams))

	if err != nil {
		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	limit, err := utils.SafeInt32ToUInt64(query.PaginationQueryParams.PageSize)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	builder := r.constructBaseQuery(ctx, query)

	builder = builder.
		Offset(offset).
		Limit(limit).
		OrderBy("created_at DESC")

	queryStr, args, err := builder.ToSql()

	if err != nil {
		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	rows, err := r.pool.Query(ctx, queryStr, args...)

	if err != nil {
		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	defer rows.Close()

	var rowItems []db.Report

	for rows.Next() {
		var row db.Report

		err := rows.Scan(
			&row.ID,
			&row.ResourceID,
			&row.ResourceType,
			&row.ReporterID,
			&row.Description,
			&row.Reason,
			&row.Resolved,
			&row.ResolvedAt,
			&row.CreatedAt,
			&row.UpdatedAt,
		)

		if err != nil {
			return nil, errors.Wrap(ErrFailedToList, err.Error())
		}

		rowItems = append(rowItems, row)
	}

	if err := rows.Err(); err != nil {
		return nil, errors.Wrap(ErrFailedToList, err.Error())
	}

	reports := make([]dto.Report, len(rowItems))

	for i, report := range rowItems {
		reports[i] = dto.ToReport(report)
	}

	return reports, nil
}

func (r *Repository) countByQuery(ctx context.Context, query *Query) (int64, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	builder := r.constructBaseQuery(ctx, query)

	queryStr, args, err := builder.ToSql()

	if err != nil {
		return 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	row := r.pool.QueryRow(ctx, queryStr, args...)

	var count int64

	err = row.Scan(&count)

	if err != nil {
		return 0, errors.Wrap(ErrFailedToList, err.Error())
	}

	return count, nil
}

func (r *Repository) constructBaseQuery(ctx context.Context, query *Query) sq.SelectBuilder {
	psql := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)

	builder := psql.Select("*").From("reports")

	if query.ReporterID != "" {
		builder = builder.Where(sq.Eq{"reporter_id": query.ReporterID})
	}

	if query.ResourceType != "" {
		builder = builder.Where(sq.Eq{"resource_type": query.ResourceType})
	}

	if query.Reason != 0 {
		builder = builder.Where(sq.Eq{"reason": query.Reason})
	}

	if !query.Resolved {
		builder = builder.Where(sq.Eq{"resolved": query.Resolved})
	}

	return builder
}
