import { describe, expect, test } from 'vitest';
import { seo } from './seo';

describe('Lib/SEO', () => {
	test('should have the default title', () => {
		const res = seo({});
		expect(res.meta).toEqual([
			{
				title: 'Wanderlust',
			},
		]);
	});

	test('should have the default title with template', () => {
		const res = seo({ title: 'Test' });
		expect(res.meta).toEqual([
			{
				title: 'Test | Wanderlust',
			},
		]);
	});
});
