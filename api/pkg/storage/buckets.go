package storage

var Buckets = []string{
	"default",
	"profile-images",
	"banner-images",
	"places",
	"reviews",
	"diaries",
	"exports",
}

type BucketName string

const (
	BUCKET_DEFAULT        BucketName = "default"
	BUCKET_PROFILE_IMAGES BucketName = "profile-images"
	BUCKET_BANNER_IMAGES  BucketName = "banner-images"
	BUCKET_PLACES         BucketName = "places"
	BUCKET_REVIEWS        BucketName = "reviews"
	BUCKET_DIARIES        BucketName = "diaries"
	BUCKET_EXPORTS        BucketName = "exports"
)

func ToBucketName(str string) (BucketName, error) {
	switch str {
	case string(BUCKET_DEFAULT):
		return BUCKET_DEFAULT, nil
	case string(BUCKET_PROFILE_IMAGES):
		return BUCKET_PROFILE_IMAGES, nil
	case string(BUCKET_BANNER_IMAGES):
		return BUCKET_BANNER_IMAGES, nil
	case string(BUCKET_PLACES):
		return BUCKET_PLACES, nil
	case string(BUCKET_REVIEWS):
		return BUCKET_REVIEWS, nil
	case string(BUCKET_DIARIES):
		return BUCKET_DIARIES, nil
	case string(BUCKET_EXPORTS):
		return BUCKET_EXPORTS, nil
	default:
		return "", ErrInvalidBucketType
	}
}
