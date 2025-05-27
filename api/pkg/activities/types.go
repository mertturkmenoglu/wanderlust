package activities

type ActivityType string

const (
	ActivityFollow   ActivityType = "activity-follow"
	ActivityFavorite ActivityType = "activity-favorite"
	ActivityReview   ActivityType = "activity-review"
)

type FollowPayload struct {
	ThisUsername  string `json:"thisUsername"`
	OtherUsername string `json:"otherUsername"`
}

type FavoritePayload struct {
	PoiName string `json:"poiName"`
	PoiId   string `json:"poiId"`
}

type ReviewPayload struct {
	PoiName string `json:"poiName"`
	PoiId   string `json:"poiId"`
	Rating  int16  `json:"rating"`
}
