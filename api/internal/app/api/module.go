package api

import "github.com/labstack/echo/v4"

type IModule interface {
	RegisterRoutes(e *echo.Group)
}
