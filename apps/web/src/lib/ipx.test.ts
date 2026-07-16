import { beforeEach, describe, expect, test, vi } from 'vitest';
import { env } from './env';
import { ipx } from './ipx';

vi.mock('./env', () => ({
	env: {
		VITE_ENABLE_IPX: false,
		VITE_IMG_PROXY_URL: '',
	},
}));

describe('Lib/IPX', () => {
	const baseUrl = 'https://example.com';

	beforeEach(() => {
		// reset to a known state so tests don't leak into each other
		env.VITE_ENABLE_IPX = false;
		env.VITE_IMG_PROXY_URL = 'https://example.com';
	});

	test('should return the original URL when IPX is disabled', async () => {
		env.VITE_ENABLE_IPX = false;
		env.VITE_IMG_PROXY_URL = baseUrl;

		const originalUrl = 'https://example.com/image.jpg';
		const ops = 'resize=100x100';
		const expected = originalUrl;
		const result = ipx(originalUrl, ops);

		expect(result).toBe(expected);
	});

	test('should return the IPX URL when IPX is enabled', async () => {
		const baseUrl = 'https://example.com';
		env.VITE_ENABLE_IPX = true;
		env.VITE_IMG_PROXY_URL = baseUrl;

		const originalUrl = 'https://example.com/image.jpg';
		const ops = 'resize=100x100';
		const expected = `${baseUrl}/${ops}/${originalUrl}`;
		const result = ipx(originalUrl, ops);

		expect(result).toBe(expected);
	});

	test('should handle empty original URL', async () => {
		env.VITE_ENABLE_IPX = true;
		env.VITE_IMG_PROXY_URL = baseUrl;

		const originalUrl = '';
		const ops = 'resize=100x100';
		const expected = `${baseUrl}/${ops}/`;
		const result = ipx(originalUrl, ops);

		expect(result).toBe(expected);
	});

	test('should handle empty operations', async () => {
		env.VITE_ENABLE_IPX = true;
		env.VITE_IMG_PROXY_URL = baseUrl;

		const originalUrl = 'https://example.com/image.jpg';
		const ops = '';
		const expected = `${baseUrl}//${originalUrl}`;
		const result = ipx(originalUrl, ops);

		expect(result).toBe(expected);
	});
});
