package upload

var Buckets = []string{
	"default",
	"profile-images",
	"banner-images",
	"pois",
	"reviews",
	"diaries",
}

type BucketName string

const (
	BUCKET_DEFAULT        BucketName = "default"
	BUCKET_PROFILE_IMAGES BucketName = "profile-images"
	BUCKET_BANNER_IMAGES  BucketName = "banner-images"
	BUCKET_POIS           BucketName = "pois"
	BUCKET_REVIEWS        BucketName = "reviews"
	BUCKET_DIARIES        BucketName = "diaries"
)
