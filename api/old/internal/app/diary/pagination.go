package diary

import (
	"time"
	"wanderlust/internal/pkg/pagination"

	"github.com/labstack/echo/v4"
)

type DiaryPaginationParams struct {
	pagination.Params
	From *time.Time
	To   *time.Time
}

func getPaginationParamsFromContext(c echo.Context) (DiaryPaginationParams, error) {
	pp, err := pagination.GetParamsFromContext(c)

	if err != nil {
		return DiaryPaginationParams{}, err
	}

	fromParam := c.QueryParam("from")
	toParam := c.QueryParam("to")

	if fromParam == "" && toParam == "" {
		return DiaryPaginationParams{
			Params: pp,
			From:   nil,
			To:     nil,
		}, nil
	}

	from, err := time.Parse(time.DateOnly, fromParam)

	if err != nil {
		return DiaryPaginationParams{}, ErrPaginationFromParam
	}

	to, err := time.Parse(time.DateOnly, toParam)

	if err != nil {
		return DiaryPaginationParams{}, ErrPaginationToParam
	}

	if from.After(to) {
		return DiaryPaginationParams{}, ErrPaginationDateRange
	}

	return DiaryPaginationParams{
		Params: pp,
		From:   &from,
		To:     &to,
	}, nil
}
