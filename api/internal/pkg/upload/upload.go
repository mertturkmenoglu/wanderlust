package upload

import (
	"context"
	"log"
	"wanderlust/config"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/spf13/viper"
)

type Upload struct {
	Client  *minio.Client
	Context context.Context
}

func New() *Upload {
	endpoint := viper.GetString(config.MINIO_ENDPOINT)
	id := viper.GetString(config.MINIO_USER)
	secret := viper.GetString(config.MINIO_PASSWORD)

	client, err := minio.New(endpoint, &minio.Options{
		Creds: credentials.NewStaticV4(id, secret, ""),
	})

	if err != nil {
		log.Fatal("cannot create minio client", err.Error())
	}

	up := &Upload{
		Client:  client,
		Context: context.Background(),
	}

	autocreateBuckets := viper.GetBool(config.MINIO_AUTOCREATE_BUCKETS)

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
	buckets := viper.GetStringSlice(config.MINIO_BUCKETS)
	bucketInfo := make([]*minio.BucketInfo, 0)

	for _, bucketName := range buckets {
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
	location := viper.GetString(config.MINIO_LOCATION)
	// Create a bucket
	err := up.Client.MakeBucket(up.Context, bucket, minio.MakeBucketOptions{
		Region: location,
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
