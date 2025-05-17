package middlewares

import (
	"log"
	"os"
	"wanderlust/pkg/random"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func CustomRecovery() echo.MiddlewareFunc {
	return middleware.RecoverWithConfig(middleware.RecoverConfig{
		LogErrorFunc: func(c echo.Context, err error, stack []byte) error {
			f, _ := os.Create("tmp/" + random.FromLetters(16) + ".log")
			defer f.Close()

			f.Write([]byte(err.Error()))
			f.Write(stack)
			log.Println(err)

			return err
		},
	})
}
