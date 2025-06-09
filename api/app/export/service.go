package export

import (
	"context"
	"encoding/json"
	"time"
	"wanderlust/pkg/cache"
	"wanderlust/pkg/core"
	"wanderlust/pkg/db"
	"wanderlust/pkg/dto"
	"wanderlust/pkg/tasks"
	"wanderlust/pkg/tracing"

	"github.com/danielgtaylor/huma/v2"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Service struct {
	core.Application
	db   *db.Queries
	pool *pgxpool.Pool
}

func (s *Service) startNewExportTask(ctx context.Context, body dto.StartNewExportTaskInputBody) (*dto.StartNewExportTaskOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	if !isAdmin(ctx) {
		err := huma.Error403Forbidden("You are not authorized to start a new export task")
		sp.RecordError(err)
		return nil, err
	}

	exportTask := dto.ExportTaskMetadata{
		ID:        s.ID.UUID(),
		CreatedAt: time.Now(),
		Status:    "pending",
		Progress:  0,
		Error:     nil,
		File:      nil,
		IDs:       body.PoiIds,
		Include:   body.Include,
	}

	key := cache.KeyBuilder("export", exportTask.ID)

	err := s.Cache.SetObj(
		ctx,
		key,
		exportTask,
		0,
	)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to create export task")
	}

	err = s.Cache.LPush(ctx, "exports", key).Err()

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to add export task to exports queue")
	}

	_, err = s.Tasks.CreateAndEnqueue(tasks.Job{
		Type: tasks.TypeExportPois,
		Data: tasks.ExportPoisPayload{
			TaskMetadata: exportTask,
		},
	})

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to enqueue export task")
	}

	return &dto.StartNewExportTaskOutput{
		Body: dto.StartNewExportTaskOutputBody{
			Task: exportTask,
		},
	}, nil
}

func (s *Service) get(ctx context.Context, id string) (*dto.GetExportByIdOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	if !isAdmin(ctx) {
		err := huma.Error403Forbidden("You are not authorized to get export metadata")
		sp.RecordError(err)
		return nil, err
	}

	key := cache.KeyBuilder("export", id)
	var metadata dto.ExportTaskMetadata

	err := s.Cache.ReadObj(ctx, key, &metadata)

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get export metadata")
	}

	return &dto.GetExportByIdOutput{
		Body: dto.GetExportByIdOutputBody{
			Export: metadata,
		},
	}, nil
}

func (s *Service) list(ctx context.Context) (*dto.GetListOfExportsOutput, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	if !isAdmin(ctx) {
		err := huma.Error403Forbidden("You are not authorized to get list of exports")
		sp.RecordError(err)
		return nil, err
	}

	var cursor uint64 = 0
	keys := make([]string, 0)
	pattern := "export:*"

	for {
		var batch []string
		var err error

		batch, cursor, err = s.Cache.Scan(ctx, cursor, pattern, 1000).Result()

		if err != nil {
			sp.RecordError(err)
			return nil, huma.Error500InternalServerError("Failed to get list of exports")
		}

		keys = append(keys, batch...)

		if cursor == 0 {
			break
		}
	}

	if len(keys) == 0 {
		return &dto.GetListOfExportsOutput{
			Body: dto.GetListOfExportsOutputBody{
				Exports: []dto.ExportTaskMetadata{},
			},
		}, nil
	}

	values, err := s.Cache.MGet(ctx, keys...).Result()

	if err != nil {
		sp.RecordError(err)
		return nil, huma.Error500InternalServerError("Failed to get export metadata")
	}

	exports := make([]dto.ExportTaskMetadata, 0)

	for i := range keys {
		if values[i] != nil {
			var obj dto.ExportTaskMetadata
			err := json.Unmarshal([]byte(values[i].(string)), &obj)

			if err != nil {
				sp.RecordError(err)
				return nil, huma.Error500InternalServerError("Failed to get export metadata")
			}

			exports = append(exports, obj)
		}
	}

	return &dto.GetListOfExportsOutput{
		Body: dto.GetListOfExportsOutputBody{
			Exports: exports,
		},
	}, nil
}
