import type { S3ClientConfig } from '@aws-sdk/client-s3';
import type { ConfigService } from '@wanderlust/config';
import { S3Driver } from 'flydrive/drivers/s3';
import type { Bucket } from './buckets';

export function getFilenameFromUrl(url: string): string {
	return url.split('/').at(-1) ?? '';
}

export function createPathname(bucket: Bucket, filename: string) {
	return `${bucket}/${filename}`;
}

export function splitFilename(filename: string): [string, string] {
	const parts = filename.split('.');
	if (parts.length !== 2) {
		throw new Error('Invalid filename');
	}
	// biome-ignore lint/style/noNonNullAssertion: we check length above
	return [parts[0]!, parts[1]!];
}

export function getExtension(filename: string) {
	return filename.split('.').at(-1);
}

type BaseDriverConfig = S3ClientConfig;

export function createDriverFactory(cfg: ConfigService) {
	return {
		createDriver(bucket: Bucket) {
			const baseDriverConfig = {
				credentials: {
					accessKeyId: cfg.storage.accessKeyId,
					secretAccessKey: cfg.storage.secretAccessKey,
				},
				region: cfg.storage.region,
				endpoint: cfg.storage.endpoint,
				forcePathStyle: true,
			} satisfies BaseDriverConfig;

			switch (bucket) {
				case 'default':
					return new S3Driver({
						...baseDriverConfig,
						bucket: 'default',
						visibility: 'public',
					});
				case 'profile-images':
					return new S3Driver({
						...baseDriverConfig,
						bucket: 'profile-images',
						visibility: 'public',
					});
				case 'banner-images':
					return new S3Driver({
						...baseDriverConfig,
						bucket: 'banner-images',
						visibility: 'public',
					});
				case 'reviews':
					return new S3Driver({
						...baseDriverConfig,
						bucket: 'reviews',
						visibility: 'public',
					});
				default:
					throw new Error(`Unknown bucket: ${bucket}`);
			}
		},
	};
}
