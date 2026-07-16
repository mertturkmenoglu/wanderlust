import { describe, expect, test } from 'vitest';
import { amenitiesDisplayNames } from './amenities';

describe('Lib/Amenities', () => {
	test('amenities count should be divisible by 3', () => {
		// Because for every amenity option we also have
		// .0 and .1 variants, so the total count should be divisible by 3

		// If not, it means we have an amenity option that is missing a variant, which will break the UI
		expect(amenitiesDisplayNames.size % 3).toBe(0);
	});
});
