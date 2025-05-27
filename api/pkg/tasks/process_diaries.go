package tasks

import (
	"context"
	"errors"

	"github.com/hibiken/asynq"
	"github.com/minio/minio-go/v7"
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

	const bucket = "diaries"
	errs := make([]error, 0)

	for _, name := range p.ObjectNames {
		err = ts.uploadSvc.Client.RemoveObject(ctx, bucket, name, minio.RemoveObjectOptions{})

		if err != nil {
			errs = append(errs, err)
		}
	}

	if len(errs) > 0 {
		return errors.Join(errs...)
	}

	return nil
}
