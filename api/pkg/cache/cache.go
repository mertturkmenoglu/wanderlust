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

func (c *Cache) ReadObj(ctx context.Context, key string, v any) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	res, err := c.Get(ctx, key).Result()

	if err != nil {
		sp.RecordError(err)
		return err
	}

	err = json.Unmarshal([]byte(res), v)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	return nil
}

func (c *Cache) SetObj(ctx context.Context, key string, data any, exp time.Duration) error {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	serialized, err := json.Marshal(data)

	if err != nil {
		sp.RecordError(err)
		return err
	}

	return c.Set(ctx, key, string(serialized), exp).Err()
}

func (c *Cache) FmtKey(name string, id string) string {
	return fmt.Sprintf("%s:%s", name, id)
}

func (c *Cache) Has(ctx context.Context, key string) bool {
	ctx, sp := tracing.NewSpan(ctx)
	defer sp.End()

	_, err := c.Get(ctx, key).Result()
	return err == nil
}
