package api

import (
	"errors"
	"fmt"
	"net/http"
	"wanderlust/internal/pkg/pagination"

	"github.com/labstack/echo/v4"
)

type ErrorResponse struct {
	Errors []ErrorDto `json:"errors"`
}

type Response struct {
	Data interface{} `json:"data"`
}

type PaginatedResponse struct {
	Data       interface{}           `json:"data"`
	Pagination pagination.Pagination `json:"pagination"`
}

type MetadataResponse struct {
	Data interface{} `json:"data"`
	Meta interface{} `json:"meta"`
}

type ErrorDto struct {
	Status string `json:"status"`
	Code   string `json:"code"`
	Title  string `json:"title"`
	Detail string `json:"detail"`
}

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

type ApiError struct {
	Status int
	Code   string
	Err    error
}

func (e ApiError) Error() string {
	return e.Err.Error()
}

func NewApiError(status int, code string, err error) ApiError {
	return ApiError{
		Status: status,
		Code:   code,
		Err:    err,
	}
}

var InternalServerError = NewApiError(http.StatusInternalServerError, "0000", errors.New("internal server error"))
