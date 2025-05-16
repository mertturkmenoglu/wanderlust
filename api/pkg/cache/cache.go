package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"time"
	"wanderlust/pkg/cfg"

	"github.com/redis/go-redis/v9"
)

type Cache struct {
	Client  *redis.Client
	Context context.Context
}

func New() *Cache {
	options, err := redis.ParseURL(cfg.Env.RedisURL)

	if err != nil {
		panic(err)
	}

	client := redis.NewClient(options)

	return &Cache{
		Client:  client,
		Context: context.Background(),
	}
}

func (c *Cache) Get(key string) (string, error) {
	return c.Client.Get(c.Context, key).Result()
}

func (c *Cache) Set(key string, value string, exp time.Duration) error {
	return c.Client.Set(c.Context, key, value, exp).Err()
}

func (c *Cache) Del(key string) error {
	return c.Client.Del(c.Context, key).Err()
}

func (c *Cache) ReadObj(key string, v any) error {
	res, err := c.Get(key)

	if err != nil {
		return err
	}

	err = json.Unmarshal([]byte(res), v)

	if err != nil {
		return err
	}

	return nil
}

func (c *Cache) SetObj(key string, data any, exp time.Duration) error {
	serialized, err := json.Marshal(data)

	if err != nil {
		return err
	}

	return c.Set(key, string(serialized), exp)
}

func (c *Cache) FmtKey(name string, id string) string {
	return fmt.Sprintf("%s:%s", name, id)
}

func (c *Cache) Has(key string) bool {
	_, err := c.Get(key)
	return err == nil
}

func (c *Cache) IncrBy(key string, amount int64) error {
	return c.Client.IncrBy(c.Context, key, amount).Err()
}
