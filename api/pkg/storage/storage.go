package storage

import (
	"context"
	"fmt"
	"net/url"

	"gocloud.dev/blob"
	"gocloud.dev/blob/fileblob"
)

var driver = "file"

func OpenBucket(ctx context.Context, bucket BucketName) (*blob.Bucket, error) {
	if driver == "file" {
		path := "./tmp/storage/" + string(bucket)
		return fileblob.OpenBucket(path, &fileblob.Options{
			NoTempDir: true,
			CreateDir: true,
			URLSigner: fileblob.NewURLSignerHMAC(&url.URL{
				Scheme: "http",
				Host:   "localhost:5000",
				Path:   "/uploads",
			}, []byte("secret")),
		})
	}

	// TODO: add s3 driver
	return nil, fmt.Errorf("driver not supported")
}
