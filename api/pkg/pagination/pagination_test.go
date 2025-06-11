package pagination

import (
	"testing"
	"wanderlust/pkg/dto"
)

func TestGetOffsetShouldPass(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name     string
		params   dto.PaginationQueryParams
		expected int32
	}{
		{
			name: "page 1, page size 1",
			params: dto.PaginationQueryParams{
				Page:     1,
				PageSize: 1,
			},
			expected: 0,
		},
		{
			name: "page 1, page size 100",
			params: dto.PaginationQueryParams{
				Page:     1,
				PageSize: 100,
			},
			expected: 0,
		},
		{
			name: "page 1, page size 1000",
			params: dto.PaginationQueryParams{
				Page:     1,
				PageSize: 1000,
			},
			expected: 0,
		},
		{
			name: "page 1, page size 1001",
			params: dto.PaginationQueryParams{
				Page:     1,
				PageSize: 1001,
			},
			expected: 0,
		},
		{
			name: "page 1, page size 50",
			params: dto.PaginationQueryParams{
				Page:     1,
				PageSize: 50,
			},
			expected: 0,
		},
		{
			name: "page 2, page size 1",
			params: dto.PaginationQueryParams{
				Page:     2,
				PageSize: 1,
			},
			expected: 1,
		},
		{
			name: "page 2, page size 100",
			params: dto.PaginationQueryParams{
				Page:     2,
				PageSize: 100,
			},
			expected: 100,
		},
		{
			name: "page 2, page size 1000",
			params: dto.PaginationQueryParams{
				Page:     2,
				PageSize: 1000,
			},
			expected: 1000,
		},
		{
			name: "page 4, page size 50",
			params: dto.PaginationQueryParams{
				Page:     4,
				PageSize: 50,
			},
			expected: 150,
		},
		{
			name: "page 0, page size 0",
			params: dto.PaginationQueryParams{
				Page:     0,
				PageSize: 0,
			},
			expected: 0,
		},
		{
			name: "page 0, page size 1",
			params: dto.PaginationQueryParams{
				Page:     0,
				PageSize: 1,
			},
			expected: 0,
		},
		{
			name: "page -1, page size 1",
			params: dto.PaginationQueryParams{
				Page:     -1,
				PageSize: 1,
			},
			expected: 0,
		},
		{
			name: "page -1, page size 0",
			params: dto.PaginationQueryParams{
				Page:     -1,
				PageSize: 0,
			},
			expected: 0,
		},
		{
			name: "page -1, page size -1",
			params: dto.PaginationQueryParams{
				Page:     -1,
				PageSize: -1,
			},
			expected: 0,
		},
	}

	for _, test := range tests {
		test := test

		t.Run(test.name, func(t *testing.T) {
			t.Parallel()

			actual := GetOffset(test.params)

			if actual != test.expected {
				t.Errorf("expected %d, got %d", test.expected, actual)
			}
		})
	}
}

func TestComputeShouldPass(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name     string
		params   dto.PaginationQueryParams
		total    int64
		expected dto.PaginationInfo
	}{
		{
			name: "Page 2, Page Size 10, Total 100",
			params: dto.PaginationQueryParams{
				Page:     2,
				PageSize: 10,
			},
			total: 100,
			expected: dto.PaginationInfo{
				Page:         2,
				PageSize:     10,
				TotalRecords: 100,
				TotalPages:   10,
				HasPrevious:  true,
				HasNext:      true,
			},
		},
		{
			name: "Page 1, Page Size 10, Total 95",
			params: dto.PaginationQueryParams{
				Page:     1,
				PageSize: 10,
			},
			total: 95,
			expected: dto.PaginationInfo{
				Page:         1,
				PageSize:     10,
				TotalRecords: 95,
				TotalPages:   10,
				HasPrevious:  false,
				HasNext:      true,
			},
		},
		{
			name: "Page 10, Page Size 10, Total 95",
			params: dto.PaginationQueryParams{
				Page:     10,
				PageSize: 10,
			},
			total: 95,
			expected: dto.PaginationInfo{
				Page:         10,
				PageSize:     10,
				TotalRecords: 95,
				TotalPages:   10,
				HasPrevious:  true,
				HasNext:      false,
			},
		},
		{
			name: "Page 12, Page Size 10, Total 95",
			params: dto.PaginationQueryParams{
				Page:     12,
				PageSize: 10,
			},
			total: 95,
			expected: dto.PaginationInfo{
				Page:         12,
				PageSize:     10,
				TotalRecords: 95,
				TotalPages:   10,
				HasPrevious:  true,
				HasNext:      false,
			},
		},
		{
			name: "Page 1, Page Size 10, Total 0",
			params: dto.PaginationQueryParams{
				Page:     1,
				PageSize: 10,
			},
			total: 0,
			expected: dto.PaginationInfo{
				Page:         1,
				PageSize:     10,
				TotalRecords: 0,
				TotalPages:   0,
				HasPrevious:  false,
				HasNext:      false,
			},
		},
		{
			name: "Page 1, Page Size 100, Total 95",
			params: dto.PaginationQueryParams{
				Page:     1,
				PageSize: 100,
			},
			total: 95,
			expected: dto.PaginationInfo{
				Page:         1,
				PageSize:     100,
				TotalRecords: 95,
				TotalPages:   1,
				HasPrevious:  false,
				HasNext:      false,
			},
		},
		{
			name: "Page 4, Page Size 30, Total 95",
			params: dto.PaginationQueryParams{
				Page:     4,
				PageSize: 30,
			},
			total: 95,
			expected: dto.PaginationInfo{
				Page:         4,
				PageSize:     30,
				TotalRecords: 95,
				TotalPages:   4,
				HasPrevious:  true,
				HasNext:      false,
			},
		},
	}

	for _, test := range tests {
		test := test

		t.Run(test.name, func(t *testing.T) {
			t.Parallel()

			actual := Compute(test.params, test.total)

			if actual != test.expected {
				t.Errorf("expected %v, got %v", test.expected, actual)
			}
		})
	}
}
