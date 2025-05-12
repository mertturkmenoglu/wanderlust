package pagination

import "wanderlust/pkg/dto"

func GetOffset(params dto.PaginationQueryParams) int {
	return (params.Page - 1) * params.PageSize
}

func Compute(params dto.PaginationQueryParams, totalRecords int64) dto.PaginationInfo {
	modulo := totalRecords % int64(params.PageSize)
	var carry int64 = 0

	if modulo > 0 && totalRecords > 0 {
		carry = 1
	}

	totalPages := totalRecords/int64(params.PageSize) + carry
	hasPrevious := params.Page > 1 && totalRecords > 0
	hasNext := int64(params.Page) < totalPages && totalRecords > 0

	return dto.PaginationInfo{
		Page:         params.Page,
		PageSize:     params.PageSize,
		TotalRecords: totalRecords,
		TotalPages:   totalPages,
		HasPrevious:  hasPrevious,
		HasNext:      hasNext,
	}
}
