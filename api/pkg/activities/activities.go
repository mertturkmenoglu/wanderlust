package activities

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"wanderlust/pkg/cache"
)

type ActivityService struct {
	cache *cache.Cache
}

func New(cache *cache.Cache) *ActivityService {
	return &ActivityService{
		cache: cache,
	}
}

type Activity struct {
	UserID  string       `json:"userId"`
	Type    ActivityType `json:"type"`
	Payload any          `json:"payload"`
}

func (svc *ActivityService) Add(ctx context.Context, activity Activity) error {
	key := cache.KeyBuilder("activities", activity.UserID)

	if activity.Payload == nil {
		err := errors.New("payload is nil")
		return fmt.Errorf("adding activity: %w", err)
	}

	serialized, err := json.Marshal(map[string]any{
		"type":    activity.Type,
		"payload": activity.Payload,
	})

	if err != nil {
		return fmt.Errorf("marshaling activity: %w", err)
	}

	_, err = svc.cache.Client.LPush(ctx, key, serialized).Result()

	if err != nil {
		return fmt.Errorf("pushing activity to redis: %w", err)
	}

	_, err = svc.cache.Client.LTrim(ctx, key, 0, 100).Result()

	if err != nil {
		return fmt.Errorf("trimming activity list: %w", err)
	}

	return nil
}
