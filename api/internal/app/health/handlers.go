package health

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// GetHealth godoc
//
//	@Summary		Health Check
//	@Description	An endpoint to be used by load balancers to check the health of the service.
//	@Tags			Health
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	GetHealthResponseDto
//	@Router			/health/ [get]
func (h *handlers) getHealth(c echo.Context) error {
	return c.JSON(http.StatusOK, GetHealthResponseDto{
		Message: "OK",
	})
}
