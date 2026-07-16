import { describe, expect, test } from 'vitest';
import { deserializer } from './use-recent-views';

describe('Hooks/UseRecentViews', () => {
	test('deserializer should return empty array for invalid JSON', () => {
		const input = 'invalid JSON';
		const result = deserializer(input);
		expect(result).toEqual([]);
	});

	test('deserializer should return empty array for valid JSON but invalid data', () => {
		const input = JSON.stringify([
			{ id: 1, name: 'Test', image: 'invalid-url' },
		]);
		const result = deserializer(input);
		expect(result).toEqual([]);
	});

	test('deserializer should return valid data for valid JSON and valid data', () => {
		const obj = {
			id: '1',
			name: 'Test',
			image: 'https://example.com/image.jpg',
		};
		const input = JSON.stringify([obj]);
		const result = deserializer(input);
		expect(result).toEqual([obj]);
	});
});
