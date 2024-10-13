package middlewares

import (
	"net/http"
	"strings"
	"time"
	"wanderlust/config"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/spf13/viper"
	"golang.org/x/time/rate"
)

func GetRateLimiterConfig() middleware.RateLimiterConfig {
	env := viper.GetString(config.ENV)
	isProd := strings.Contains(env, "prod")
	var r float64 = 100
	var burst int = 50

	if !isProd {
		r = 1_000_000
		burst = 100_000
	}

	return middleware.RateLimiterConfig{
		Skipper: middleware.DefaultSkipper,
		Store: middleware.NewRateLimiterMemoryStoreWithConfig(
			middleware.RateLimiterMemoryStoreConfig{
				Rate:      rate.Limit(r),
				Burst:     burst,
				ExpiresIn: 1 * time.Minute,
			},
		),
		IdentifierExtractor: func(context echo.Context) (string, error) {
			return context.RealIP(), nil
		},
		ErrorHandler: func(context echo.Context, err error) error {
			return context.JSON(http.StatusForbidden, nil)
		},
		DenyHandler: func(context echo.Context, identifier string, err error) error {
			return context.JSON(http.StatusTooManyRequests, nil)
		},
	}
}
