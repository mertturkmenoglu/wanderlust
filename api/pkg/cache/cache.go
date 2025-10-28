package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"time"
	"wanderlust/pkg/cfg"
	"wanderlust/pkg/tracing"

	"github.com/redis/go-redis/v9"
)

type Cache struct {
	*redis.Client
}

func New() *Cache {
	options, err := redis.ParseURL(cfg.Env.RedisURL)

	if err != nil {
		panic(err)
	}

	client := redis.NewClient(options)

	return &Cache{
		Client: client,
	}
}

func (c *Cache) Read(ctx context.Context, key string) (interface{}, error) {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := c.Get(ctx, key).Result()

	if err != nil {
		sp.RecordError(err)
		return nil, fmt.Errorf("getting key %s: %w", key, err)
	}

	var v any

	err = json.Unmarshal([]byte(res), &v)

	if err != nil {
		sp.RecordError(err)
		return nil, fmt.Errorf("unmarshaling key %s: %w", key, err)
	}

	return v, nil
}

func (c *Cache) ReadObj(ctx context.Context, key string, v any) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := c.Get(ctx, key).Result()

	if err != nil {
		sp.RecordError(err)
		return fmt.Errorf("getting key %s: %w", key, err)
	}

	err = json.Unmarshal([]byte(res), v)

	if err != nil {
		sp.RecordError(err)
		return fmt.Errorf("unmarshaling key %s: %w", key, err)
	}

	return nil
}

func (c *Cache) Write(ctx context.Context, key string, data any, exp time.Duration) error {
	return c.SetObj(ctx, key, data, exp)
}

func (c *Cache) SetObj(ctx context.Context, key string, data any, exp time.Duration) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	serialized, err := json.Marshal(data)

	if err != nil {
		sp.RecordError(err)
		return fmt.Errorf("marshaling key %s: %w", key, err)
	}

	err = c.Set(ctx, key, string(serialized), exp).Err()

	if err != nil {
		sp.RecordError(err)
		return fmt.Errorf("setting key %s: %w", key, err)
	}

	return nil
}

func (c *Cache) Has(ctx context.Context, key string) bool {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	_, err := c.Get(ctx, key).Result()
	return err == nil
}
