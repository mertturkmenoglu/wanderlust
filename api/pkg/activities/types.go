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
	PlaceName string `json:"placeName"`
	PlaceID   string `json:"placeId"`
}

type ReviewPayload struct {
	PlaceName string `json:"placeName"`
	PlaceID   string `json:"placeId"`
	Rating    int16  `json:"rating"`
}
