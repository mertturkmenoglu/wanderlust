package aggregator

import "slices"

func contains(s []string, e string) bool {
	return slices.ContainsFunc(s, func(x string) bool {
		return x == e
	})
}
