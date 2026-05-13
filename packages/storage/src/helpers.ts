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
