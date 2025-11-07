package activities

import (
	"context"
	"encoding/json"
	"errors"
	"testing"
	"wanderlust/pkg/cache"

	"github.com/go-redis/redismock/v9"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestAddFollowActivityShouldPass(t *testing.T) {
	db, mock := redismock.NewClientMock()

	defer func() {
		require.NoError(t, mock.ExpectationsWereMet())
	}()

	svc := &ActivityService{
		cache: &cache.Cache{
			Client: db,
		},
	}

	activity := Activity{
		UserID: "user-123",
		Type:   ActivityFollow,
		Payload: FollowPayload{
			ThisUsername:  "user-123",
			OtherUsername: "user-456",
		},
	}

	serialized, err := json.Marshal(map[string]any{
		"type":    activity.Type,
		"payload": activity.Payload,
	})

	assert.NoError(t, err)

	mock.ExpectLPush("activities:user-123", serialized).SetVal(1)
	mock.ExpectLTrim("activities:user-123", 0, 100).SetVal("OK")

	err = svc.Add(context.Background(), activity)

	assert.NoError(t, err)
}

func TestAddFavoriteActivityShouldPass(t *testing.T) {
	db, mock := redismock.NewClientMock()

	defer func() {
		require.NoError(t, mock.ExpectationsWereMet())
	}()

	svc := &ActivityService{
		cache: &cache.Cache{
			Client: db,
		},
	}

	activity := Activity{
		UserID: "user-123",
		Type:   ActivityFavorite,
		Payload: FavoritePayload{
			PlaceName: "Lorem Ipsum",
			PlaceID:   "place-123",
		},
	}

	serialized, err := json.Marshal(map[string]any{
		"type":    activity.Type,
		"payload": activity.Payload,
	})

	assert.NoError(t, err)

	mock.ExpectLPush("activities:user-123", serialized).SetVal(1)
	mock.ExpectLTrim("activities:user-123", 0, 100).SetVal("OK")

	err = svc.Add(context.Background(), activity)

	assert.NoError(t, err)
}

func TestAddReviewActivityShouldPass(t *testing.T) {
	db, mock := redismock.NewClientMock()

	defer func() {
		require.NoError(t, mock.ExpectationsWereMet())
	}()

	svc := &ActivityService{
		cache: &cache.Cache{
			Client: db,
		},
	}

	activity := Activity{
		UserID: "user-123",
		Type:   ActivityReview,
		Payload: ReviewPayload{
			PlaceName: "Lorem Ipsum",
			PlaceID:   "place-123",
			Rating:    5,
		},
	}

	serialized, err := json.Marshal(map[string]any{
		"type":    activity.Type,
		"payload": activity.Payload,
	})

	assert.NoError(t, err)

	mock.ExpectLPush("activities:user-123", serialized).SetVal(1)
	mock.ExpectLTrim("activities:user-123", 0, 100).SetVal("OK")

	err = svc.Add(context.Background(), activity)

	assert.NoError(t, err)
}

func TestAddActivityShouldFailWhenPayloadIsNil(t *testing.T) {
	db, mock := redismock.NewClientMock()

	defer func() {
		require.NoError(t, mock.ExpectationsWereMet())
	}()

	svc := &ActivityService{
		cache: &cache.Cache{
			Client: db,
		},
	}

	activity := Activity{
		UserID:  "user-123",
		Type:    ActivityFollow,
		Payload: nil,
	}

	err := svc.Add(context.Background(), activity)

	assert.Error(t, err)
	assert.ErrorContains(t, err, "adding activity: payload is nil")
}

func TestAddActivityShouldFailWhenPayloadIsUnserializable(t *testing.T) {
	db, mock := redismock.NewClientMock()

	defer func() {
		require.NoError(t, mock.ExpectationsWereMet())
	}()

	svc := &ActivityService{
		cache: &cache.Cache{
			Client: db,
		},
	}

	activity := Activity{
		UserID: "user-123",
		Type:   ActivityFollow,
		Payload: map[string]any{
			"channel": make(chan int),
		},
	}

	err := svc.Add(context.Background(), activity)

	assert.Error(t, err)
	assert.ErrorContains(t, err, "marshaling activity:")
}

func TestAddActivityShouldReturnCorrectErrorWhenLPushFails(t *testing.T) {
	db, mock := redismock.NewClientMock()

	defer func() {
		require.NoError(t, mock.ExpectationsWereMet())
	}()

	svc := &ActivityService{
		cache: &cache.Cache{
			Client: db,
		},
	}

	activity := Activity{
		UserID: "user-123",
		Type:   ActivityFollow,
		Payload: FollowPayload{
			ThisUsername:  "user-123",
			OtherUsername: "user-456",
		},
	}

	serialized, err := json.Marshal(map[string]any{
		"type":    activity.Type,
		"payload": activity.Payload,
	})

	assert.NoError(t, err)

	mock.ExpectLPush("activities:user-123", serialized).SetErr(errors.New("redis lpush failed"))

	err = svc.Add(context.Background(), activity)

	assert.Error(t, err)
	assert.ErrorContains(t, err, "pushing activity to redis: redis lpush failed")
}

func TestAddActivityShouldReturnCorrectErrorWhenLTrimFails(t *testing.T) {
	db, mock := redismock.NewClientMock()

	defer func() {
		require.NoError(t, mock.ExpectationsWereMet())
	}()

	svc := &ActivityService{
		cache: &cache.Cache{
			Client: db,
		},
	}

	activity := Activity{
		UserID: "user-123",
		Type:   ActivityFollow,
		Payload: FollowPayload{
			ThisUsername:  "user-123",
			OtherUsername: "user-456",
		},
	}

	serialized, err := json.Marshal(map[string]any{
		"type":    activity.Type,
		"payload": activity.Payload,
	})

	assert.NoError(t, err)

	mock.ExpectLPush("activities:user-123", serialized).SetVal(1)
	mock.ExpectLTrim("activities:user-123", 0, 100).SetErr(errors.New("redis ltrim failed"))

	err = svc.Add(context.Background(), activity)

	assert.Error(t, err)
	assert.ErrorContains(t, err, "trimming activity list: redis ltrim failed")
}
