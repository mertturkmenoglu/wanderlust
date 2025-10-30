package tasks

import (
	"context"
	"errors"
	"wanderlust/pkg/storage"

	"github.com/hibiken/asynq"
)

const (
	TypeDeleteDiaryMedia = "diary:delete-media"
)

type DeleteDiaryMediaPayload struct {
	ObjectNames []string
}

func (ts *TasksService) HandleDeleteDiaryMediaTask(ctx context.Context, t *asynq.Task) error {
	p, err := parse[DeleteDiaryMediaPayload](t.Payload())

	if err != nil {
		return err
	}

	errs := make([]error, 0)

	for _, name := range p.ObjectNames {
		bucket, err := storage.OpenBucket(ctx, storage.BUCKET_DIARIES)

		if err != nil {
			errs = append(errs, err)
			continue
		}

		err = bucket.Delete(ctx, name)

		if err != nil {
			errs = append(errs, err)
		}
	}

	if len(errs) > 0 {
		return errors.Join(errs...)
	}

	return nil
}
