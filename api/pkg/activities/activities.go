package activities

import (
	"context"
	"encoding/json"
	"wanderlust/pkg/cache"
)

type ActivityType string

const (
	ActivityFollow   ActivityType = "activity-follow"
	ActivityFavorite ActivityType = "activity-favorite"
	ActivityReview   ActivityType = "activity-review"
)

type Activity struct {
	cache *cache.Cache
}

func NewActivity(cache *cache.Cache) *Activity {
	return &Activity{
		cache: cache,
	}
}

type WithType struct {
	Type    ActivityType `json:"type"`
	Payload any          `json:"payload"`
}

func (a *Activity) Add(userId string, activityType ActivityType, payload any) error {
	key := cache.KeyBuilder("activities", userId)
	serialized, err := json.Marshal(WithType{
		Type:    activityType,
		Payload: payload,
	})

	if err != nil {
		return err
	}

	_, err = a.cache.Client.LPush(context.Background(), key, serialized).Result()

	if err != nil {
		return err
	}

	_, err = a.cache.Client.LTrim(context.Background(), key, 0, 100).Result()
	return err
}
