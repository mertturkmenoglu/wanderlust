import { env } from "@/start";
import * as Minio from "minio";

export const minioClient = new Minio.Client({
  endPoint: env.MINIO_ENDPOINT,
  port: env.MINIO_PORT,
  useSSL: env.MINIO_SSL,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
});

export async function initUpload() {
  const buckets = [env.MINIO_DEFAULT_BUCKET];
  const location = env.MINIO_LOCATION;

  for (const bucket of buckets) {
    const exists = await minioClient.bucketExists(bucket);

    if (!exists) {
      await minioClient.makeBucket(bucket, location);
    }
  }
}
