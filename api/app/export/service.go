package export

import (
	"context"
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
