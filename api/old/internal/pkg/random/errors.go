package random

import "errors"

var (
	ErrInvalidDigitsCount = errors.New("invalid digits count")
	ErrInvalidBytesCount  = errors.New("invalid bytes count")
)
