package core

import "wanderlust/internal/pkg/pagination"


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

