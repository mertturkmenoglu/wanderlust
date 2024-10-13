package logs

import (
	"os"

	"go.uber.org/zap"
)

func New() *zap.Logger {
	cfg := zap.NewProductionConfig()
	cfg.OutputPaths = []string{"horizon.log"}

	logger, err := cfg.Build()

	if err != nil {
		panic(err)
	}

	_, err = os.OpenFile("horizon.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)

	if err != nil {
		panic(err)
	}

	defer logger.Sync()

	return logger
}