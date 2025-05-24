package reviews

import "wanderlust/pkg/dto"

func canRemoveReview(review *dto.Review, userId string) bool {
	return review.UserID == userId
}

func canUploadMedia(review *dto.Review, userId string) bool {
	return review.UserID == userId
}
