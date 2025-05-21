package upload

import (
	"context"
	"log"
	"wanderlust/pkg/cfg"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type UploadService struct {
	Client   *minio.Client
	Context  context.Context
	buckets  []string
	location string
}

func New() *UploadService {
	var (
		endpoint          = cfg.Env.MinioEndpoint
		id                = cfg.Env.MinioUser
		secret            = cfg.Env.MinioPassword
		autocreateBuckets = cfg.Env.MinioAutocreateBuckets
		location          = cfg.Env.MinioLocation
	)

	client, err := minio.New(endpoint, &minio.Options{
		Creds: credentials.NewStaticV4(id, secret, ""),
	})

	if err != nil {
		log.Fatal("cannot create minio client", err.Error())
	}

	svc := &UploadService{
		Client:   client,
		Context:  context.Background(),
		buckets:  Buckets,
		location: location,
	}

	// if autocreate buckets environment variable is true, try to create buckets
	if autocreateBuckets {
		_, err = svc.autocreateBuckets()

		if err != nil {
			log.Fatal("cannot create buckets", err.Error())
		}
	}

	return svc
}

func (svc *UploadService) autocreateBuckets() ([]*minio.BucketInfo, error) {
	bucketInfo := make([]*minio.BucketInfo, 0)

	for _, bucketName := range svc.buckets {
		// Check if a bucket exists. If it already exists, skip it.
		if exists, _ := svc.Client.BucketExists(svc.Context, bucketName); !exists {
			info, err := svc.createBucket(bucketName)

			if err != nil {
				return nil, err
			} else {
				bucketInfo = append(bucketInfo, info)
			}
		}
	}

	return bucketInfo, nil
}

func (svc *UploadService) createBucket(bucket string) (*minio.BucketInfo, error) {
	// Create a bucket
	err := svc.Client.MakeBucket(svc.Context, bucket, minio.MakeBucketOptions{
		Region: svc.location,
	})

	if err != nil {
		return nil, err
	}

	err = svc.Client.SetBucketPolicy(
		context.Background(),
		bucket,
		getPublicPolicyForBucket(bucket),
	)

	if err != nil {
		return nil, err
	}

	return &minio.BucketInfo{
		Name: bucket,
	}, nil
}
