package logs

import (
	"io"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func NewZapLogger(w io.Writer) *zap.Logger {
	encoderConfig := zapcore.EncoderConfig{
		TimeKey:        "timestamp",
		LevelKey:       "level",
		NameKey:        "logger",
		CallerKey:      "caller",
		FunctionKey:    zapcore.OmitKey,
		MessageKey:     "message",
		StacktraceKey:  "stacktrace",
		LineEnding:     zapcore.DefaultLineEnding,
		EncodeLevel:    zapcore.LowercaseLevelEncoder,
		EncodeTime:     zapcore.ISO8601TimeEncoder,
		EncodeDuration: zapcore.SecondsDurationEncoder,
		EncodeCaller:   zapcore.ShortCallerEncoder,
	}

	core := zapcore.NewCore(
		zapcore.NewJSONEncoder(encoderConfig),
		zapcore.AddSync(w),
		zapcore.InfoLevel,
	)

	logger := zap.New(core,
		zap.WithCaller(true),
		zap.Fields(
			zap.String("service.name", "wanderlust"),
			zap.String("service.version", "2.0.0"),
		),
	)

	return logger
}
