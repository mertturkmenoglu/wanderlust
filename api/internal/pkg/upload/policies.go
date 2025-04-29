package upload

func getPublicPolicyForBucket(bucket string) string {
	policy := `{
					"Version": "2012-10-17",
					"Statement": [
						{
							"Effect": "Allow",
							"Principal": "*",
							"Action": "s3:GetObject",
							"Resource": "arn:aws:s3:::` + bucket + `/*"
						}
					]
				}`

	return policy
}
