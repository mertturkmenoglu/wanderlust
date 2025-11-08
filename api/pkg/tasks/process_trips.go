package tasks

import (
	"context"

	"github.com/hibiken/asynq"
)

const (
	TypeFindExpiredTripInvites  = "trip:find-expired-invites"
	TypeDeleteExpiredTripInvite = "trip:delete-expired-invite"
)

type DeleteExpiredTripInvitePayload struct {
	ID string
}

func (svc *TasksService) FindExpiredTripInvitesTask(ctx context.Context, t *asynq.Task) error {
	ids, err := svc.db.Queries.FindManyTripInvitesWhereExpired(ctx)

	if err != nil {
		return err
	}

	svc.logger.Info("FindExpiredTripInvitesTask", svc.logger.Args("count", len(ids)))

	for _, id := range ids {
		_, err = svc.CreateAndEnqueue(Job{
			Type: TypeDeleteExpiredTripInvite,
			Data: DeleteExpiredTripInvitePayload{
				ID: id,
			},
		})

		if err != nil {
			return err
		}
	}

	return nil
}

func (svc *TasksService) DeleteExpiredTripInviteTask(ctx context.Context, t *asynq.Task) error {
	p, err := parse[DeleteExpiredTripInvitePayload](t.Payload())

	if err != nil {
		return err
	}

	_, err = svc.db.Queries.RemoveTripInviteById(ctx, p.ID)

	return err
}
