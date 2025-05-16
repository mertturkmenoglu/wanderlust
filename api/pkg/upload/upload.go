package upload

import (
	"context"
	"log"
	"wanderlust/pkg/cfg"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type Upload struct {
	Client   *minio.Client
	Context  context.Context
	buckets  []string
	location string
}

func New() *Upload {
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

	up := &Upload{
		Client:   client,
		Context:  context.Background(),
		buckets:  Buckets,
		location: location,
	}

	// if autocreate buckets environment variable is true, try to create buckets
	if autocreateBuckets {
		_, err = up.autocreateBuckets()

		if err != nil {
			log.Fatal("cannot create buckets", err.Error())
		}
	}

	return up
}

func (up *Upload) autocreateBuckets() ([]*minio.BucketInfo, error) {
	bucketInfo := make([]*minio.BucketInfo, 0)

	for _, bucketName := range up.buckets {
		// Check if a bucket exists. If it already exists, skip it.
		if exists, _ := up.Client.BucketExists(up.Context, bucketName); !exists {
			info, err := up.createBucket(bucketName)

			if err != nil {
				return nil, err
			} else {
				bucketInfo = append(bucketInfo, info)
			}
		}
	}

	return bucketInfo, nil
}

func (up *Upload) createBucket(bucket string) (*minio.BucketInfo, error) {
	// Create a bucket
	err := up.Client.MakeBucket(up.Context, bucket, minio.MakeBucketOptions{
		Region: up.location,
	})

	if err != nil {
		return nil, err
	}

	// Get public access policy for the bucket
	policy := getPublicPolicyForBucket(bucket)
	// Set the policy for the bucket
	err = up.Client.SetBucketPolicy(context.Background(), bucket, policy)

	if err != nil {
		return nil, err
	}

	return &minio.BucketInfo{
		Name: bucket,
	}, nil
}
