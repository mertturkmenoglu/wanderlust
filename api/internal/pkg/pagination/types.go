package pagination

type Params struct {
	Page     int
	PageSize int
	Offset   int
}

type Pagination struct {
	Page         int   `json:"page"`
	PageSize     int   `json:"pageSize"`
	TotalRecords int64 `json:"totalRecords"`
	TotalPages   int64 `json:"totalPages"`
	HasPrevious  bool  `json:"hasPrevious"`
	HasNext      bool  `json:"hasNext"`
}
