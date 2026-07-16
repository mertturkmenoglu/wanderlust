import { describe, expect, test } from 'vitest';
import { deserializer } from './use-search-type';

describe('Hooks/UseSearchType', () => {
	test("empty string should return 'places'", () => {
		const input = '';
		const result = deserializer(input);
		expect(result).toBe('places');
	});

	test("invalid string should return 'places'", () => {
		const input = '"invalid"';
		const result = deserializer(input);
		expect(result).toBe('places');
	});

	test("valid string 'places' should return 'places'", () => {
		const input = '"places"';
		const result = deserializer(input);
		expect(result).toBe('places');
	});

	test("valid string 'cities' should return 'cities'", () => {
		const input = '"cities"';
		const result = deserializer(input);
		expect(result).toBe('cities');
	});

	test("valid string 'users' should return 'users'", () => {
		const input = '"users"';
		const result = deserializer(input);
		expect(result).toBe('users');
	});
});
