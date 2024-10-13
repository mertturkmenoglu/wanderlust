package pagination

func isValidSize(size int) bool {
	return size > 0 && size <= 100 && (size%25 == 0 || size%10 == 0)
}

func isValidPage(page int) bool {
	return page > 0
}
