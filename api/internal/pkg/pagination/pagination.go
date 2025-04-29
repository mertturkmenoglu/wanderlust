package pagination

import (
	"strconv"

	"github.com/labstack/echo/v4"
)

func GetParamsFromContext(c echo.Context) (Params, error) {
	page := c.QueryParam("page")
	size := c.QueryParam("pageSize")

	return getParamsFromValues(page, size)
}

func getParamsFromValues(page, size string) (Params, error) {
	if page == "" {
		page = "1"
	}

	if size == "" {
		size = "25"
	}

	ipage, pageErr := strconv.ParseInt(page, 10, 32)
	isize, sizeErr := strconv.ParseInt(size, 10, 32)

	if pageErr != nil || sizeErr != nil {
		return Params{}, ErrInvalidPaginationParams
	}

	if !isValidSize(int(isize)) {
		return Params{}, ErrInvalidSizeParam
	}

	if !isValidPage(int(ipage)) {
		return Params{}, ErrInvalidPageParam
	}

	params := Params{
		Page:     int(ipage),
		PageSize: int(isize),
		Offset:   int((ipage - 1) * isize),
	}

	return params, nil
}

func Compute(params Params, totalRecords int64) Pagination {
	modulo := totalRecords % int64(params.PageSize)
	var carry int64 = 0

	if modulo > 0 && totalRecords > 0 {
		carry = 1
	}

	totalPages := totalRecords/int64(params.PageSize) + carry
	hasPrevious := params.Page > 1 && totalRecords > 0
	hasNext := int64(params.Page) < totalPages && totalRecords > 0

	return Pagination{
		Page:         params.Page,
		PageSize:     params.PageSize,
		TotalRecords: totalRecords,
		TotalPages:   totalPages,
		HasPrevious:  hasPrevious,
		HasNext:      hasNext,
	}
}