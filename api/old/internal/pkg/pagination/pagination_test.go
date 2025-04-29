package pagination

import (
	"errors"
	"testing"
)

type getPaginationTestCase struct {
	params       Params
	totalRecords int64
	expected     Pagination
}

var getPaginationTestCases = []getPaginationTestCase{
	{
		params: Params{
			Page:     1,
			PageSize: 25,
		},
		totalRecords: 100,
		expected: Pagination{
			Page:         1,
			PageSize:     25,
			TotalRecords: 100,
			TotalPages:   4,
			HasPrevious:  false,
			HasNext:      true,
		},
	},
	{
		params: Params{
			Page:     2,
			PageSize: 25,
		},
		totalRecords: 100,
		expected: Pagination{
			Page:         2,
			PageSize:     25,
			TotalRecords: 100,
			TotalPages:   4,
			HasPrevious:  true,
			HasNext:      true,
		},
	},
	{
		params: Params{
			Page:     3,
			PageSize: 25,
		},
		totalRecords: 100,
		expected: Pagination{
			Page:         3,
			PageSize:     25,
			TotalRecords: 100,
			TotalPages:   4,
			HasPrevious:  true,
			HasNext:      true,
		},
	},
	{
		params: Params{
			Page:     4,
			PageSize: 25,
		},
		totalRecords: 100,
		expected: Pagination{
			Page:         4,
			PageSize:     25,
			TotalRecords: 100,
			TotalPages:   4,
			HasPrevious:  true,
			HasNext:      false,
		},
	},
	{
		params: Params{
			Page:     5,
			PageSize: 25,
		},
		totalRecords: 100,
		expected: Pagination{
			Page:         5,
			PageSize:     25,
			TotalRecords: 100,
			TotalPages:   4,
			HasPrevious:  true,
			HasNext:      false,
		},
	},
	{
		params: Params{
			Page:     1,
			PageSize: 10,
		},
		totalRecords: 8,
		expected: Pagination{
			Page:         1,
			PageSize:     10,
			TotalRecords: 8,
			TotalPages:   1,
			HasPrevious:  false,
			HasNext:      false,
		},
	},
	{
		params: Params{
			Page:     1,
			PageSize: 10,
		},
		totalRecords: 0,
		expected: Pagination{
			Page:         1,
			PageSize:     10,
			TotalRecords: 0,
			TotalPages:   0,
			HasPrevious:  false,
			HasNext:      false,
		},
	},
	{
		params: Params{
			Page:     2,
			PageSize: 10,
		},
		totalRecords: 0,
		expected: Pagination{
			Page:         2,
			PageSize:     10,
			TotalRecords: 0,
			TotalPages:   0,
			HasPrevious:  false,
			HasNext:      false,
		},
	},
	{
		params: Params{
			Page:     1,
			PageSize: 10,
		},
		totalRecords: 12,
		expected: Pagination{
			Page:         1,
			PageSize:     10,
			TotalRecords: 12,
			TotalPages:   2,
			HasPrevious:  false,
			HasNext:      true,
		},
	},
	{
		params: Params{
			Page:     2,
			PageSize: 10,
		},
		totalRecords: 12,
		expected: Pagination{
			Page:         2,
			PageSize:     10,
			TotalRecords: 12,
			TotalPages:   2,
			HasPrevious:  true,
			HasNext:      false,
		},
	},
}

const errPaginationFmtStr = "Expected %v, got %v"

func TestGetPaginationWithValidParamsShouldReturnCorrectPagination(t *testing.T) {
	for _, testCase := range getPaginationTestCases {
		actual := Compute(testCase.params, testCase.totalRecords)

		if actual != testCase.expected {
			t.Errorf(errPaginationFmtStr, testCase.expected, actual)
		}
	}
}

type getParamsFromValuesTestCase struct {
	page     string
	size     string
	expected Params
}

var getParamsFromValuesTestCases = []getParamsFromValuesTestCase{
	{
		page: "",
		size: "",
		expected: Params{
			Page:     1,
			PageSize: 25,
			Offset:   0,
		},
	},
	{
		page: "1",
		size: "25",
		expected: Params{
			Page:     1,
			PageSize: 25,
			Offset:   0,
		},
	},
	{
		page: "2",
		size: "25",
		expected: Params{
			Page:     2,
			PageSize: 25,
			Offset:   25,
		},
	},
	{
		page: "3",
		size: "25",
		expected: Params{
			Page:     3,
			PageSize: 25,
			Offset:   50,
		},
	},
	{
		page: "1",
		size: "10",
		expected: Params{
			Page:     1,
			PageSize: 10,
			Offset:   0,
		},
	},
	{
		page: "2",
		size: "10",
		expected: Params{
			Page:     2,
			PageSize: 10,
			Offset:   10,
		},
	},
	{
		page: "3",
		size: "10",
		expected: Params{
			Page:     3,
			PageSize: 10,
			Offset:   20,
		},
	},
}

func TestGetParamsFromValuesWithValidValuesShouldReturnCorrectParams(t *testing.T) {
	for _, testCase := range getParamsFromValuesTestCases {
		actual, err := getParamsFromValues(testCase.page, testCase.size)

		if err != nil {
			t.Errorf("Expected no error, got %v", err)
		}

		if actual != testCase.expected {
			t.Errorf(errPaginationFmtStr, testCase.expected, actual)
		}
	}
}

type getParamsFromValuesInvalidInputTestCase struct {
	page     string
	size     string
	expected error
}

var getParamsFromValuesInvalidInputTestCases = []getParamsFromValuesInvalidInputTestCase{
	{
		page:     "-1",
		size:     "25",
		expected: ErrInvalidPageParam,
	},
	{
		page:     "1",
		size:     "-1",
		expected: ErrInvalidSizeParam,
	},
	{
		page:     "a",
		size:     "25",
		expected: ErrInvalidPaginationParams,
	},
	{
		page:     "1",
		size:     "a",
		expected: ErrInvalidPaginationParams,
	},
	{
		page:     "a",
		size:     "a",
		expected: ErrInvalidPaginationParams,
	},
	{
		page:     "1",
		size:     "8",
		expected: ErrInvalidSizeParam,
	},
	{
		page:     "1",
		size:     "0",
		expected: ErrInvalidSizeParam,
	},
	{
		page:     "1",
		size:     "101",
		expected: ErrInvalidSizeParam,
	},
	{
		page:     "1",
		size:     "99",
		expected: ErrInvalidSizeParam,
	},
}

func TestGetParamsFromValuesWithInvalidValuesShouldReturnErrror(t *testing.T) {
	for _, testCase := range getParamsFromValuesInvalidInputTestCases {
		actual, actualErr := getParamsFromValues(testCase.page, testCase.size)

		if actualErr == nil {
			t.Errorf("Expected error, got %v", actualErr)
		}

		if !errors.Is(actualErr, testCase.expected) {
			t.Errorf(errPaginationFmtStr, testCase.expected, actual)
		}
	}
}
