# Bucket Policy

- MinIO buckets can (and are) be created programmatically.
- I haven't found a solution to changing bucket policy using only programmatic ways.
- After the buckets are created (it should be created when you first run the program), you must change bucket policies.

## Changing Bucket Policy

- Go to MinIO web UI: `localhost:9000`
- Enter the credentials. You can find the local credentials inside `docker-compose.yml` file.
- From the left side navigation select `Administrator > Buckets`.
- Click to a bucket (for example `default`).
- Find the gear symbol for settings page of this bucket.
- Open the bucket settings.
- In `Bucket Settings > Summary > Access Policy` section, change the access policy to `public`.
- Repeat this process for all other buckets.
