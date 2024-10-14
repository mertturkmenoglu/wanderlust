package errs

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
)

func NewErrs(c echo.Context, status int, errs []ErrorDto) error {
	return c.JSON(status, ErrorResponse{
		Errors: errs,
	})
}

func NewErr(c echo.Context, status int, err ApiError) error {
	return NewErrs(c, status, []ErrorDto{
		{
			Status: fmt.Sprintf("%d", status),
			Code:   err.Code,
			Title:  err.Err.Error(),
			Detail: err.Err.Error(),
		},
	})
}

func NewApiError(status int, code string, err error) ApiError {
	return ApiError{
		Status: status,
		Code:   code,
		Err:    err,
	}
}

var InternalServerError = NewApiError(http.StatusInternalServerError, "0000", errors.New("internal server error"))
