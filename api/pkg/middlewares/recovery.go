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
			f, ferr := os.Create("tmp/" + random.FromLetters(16) + ".log")

			if ferr != nil {
				return ferr
			}

			defer f.Close()

			_, ferr = f.Write([]byte(err.Error()))

			if ferr != nil {
				return ferr
			}

			_, ferr = f.Write(stack)

			if ferr != nil {
				return ferr
			}

			log.Println(err)

			return err
		},
	})
}
