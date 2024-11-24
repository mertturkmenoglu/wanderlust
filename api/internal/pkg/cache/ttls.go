package cache

import "time"

const (
	TTLHomeAggregations = 1 * time.Hour
	TTLDiaryEntry       = 1 * time.Hour
	TTLCollectionGroup  = 7 * 24 * time.Hour
)
