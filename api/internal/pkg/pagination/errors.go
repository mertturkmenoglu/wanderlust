package pagination

import "errors"

var (
	ErrInvalidPaginationParams = errors.New("invalid pagination parameters")
	ErrInvalidSizeParam        = errors.New("invalid size parameter")
	ErrInvalidPageParam        = errors.New("invalid page parameter")
)
