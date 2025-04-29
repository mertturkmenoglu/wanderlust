package errs

type ApiError struct {
	Status int
	Code   string
	Err    error
}

func (e ApiError) Error() string {
	return e.Err.Error()
}

type ErrorDto struct {
	Status string `json:"status"`
	Code   string `json:"code"`
	Title  string `json:"title"`
	Detail string `json:"detail"`
}

type ErrorResponse struct {
	Errors []ErrorDto `json:"errors"`
}
