package cache

const (
	KeyHomeAggregations = "home-aggregations"
	KeyDiaryEntry       = "diary-entry"
)

func KeyBuilder(parts ...string) string {
	key := ""
	for i, part := range parts {
		if i != 0 {
			key += ":"
		}
		key += part
	}
	return key
}
