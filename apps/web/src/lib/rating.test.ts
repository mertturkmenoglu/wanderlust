import { describe, expect, test } from 'vitest';
import { computeRating } from './rating';

describe('Lib/Rating', () => {
	test('should handle 0 votes', () => {
		const points = 0; // Arbitrary value, doesn't matter since votes are 0
		const votes = 0;
		const expected = '0.0';
		const result = computeRating(points, votes);
		expect(result).toBe(expected);
	});

	test('should compute rating correctly for non-zero votes', () => {
		const points = 45;
		const votes = 10;
		const expected = '4.5';
		const result = computeRating(points, votes);
		expect(result).toBe(expected);
	});

	test('should round to one decimal place', () => {
		const points = 7;
		const votes = 3;
		const expected = '2.3'; // 7 / 3 = 2.333..., rounded to 2.3
		const result = computeRating(points, votes);
		expect(result).toBe(expected);
	});

	test('should throw when points are negative', () => {
		const negativePoints = -5;
		const votes = 10;
		expect(() => computeRating(negativePoints, votes)).toThrow(
			'Points cannot be negative',
		);
	});

	test('should throw when votes are negative', () => {
		const points = 10;
		const negativeVotes = -3;
		expect(() => computeRating(points, negativeVotes)).toThrow(
			'Votes cannot be negative',
		);
	});
});
