import { describe, expect, test } from 'vitest';
import { getCurrentTimezoneIANAName, getIANANames } from './timezone';

describe('Lib/Timezone', () => {
	describe('Get IANA Names', () => {
		test('should return a non-empty array of IANA names', () => {
			const result = getIANANames();
			expect(result).toBeInstanceOf(Array);
			expect(result.length).toBeGreaterThan(0);
		});

		test('should include Etc/UTC in the returned array', () => {
			const result = getIANANames();
			expect(result).toContain('Etc/UTC');
		});
	});

	describe('Get Current Timezone IANA Name', () => {
		test('should return a value', () => {
			const result = getCurrentTimezoneIANAName();
			expect(result).toBeTypeOf('string');
			expect(result.length).toBeGreaterThan(0);
		});

		test('should return a valid IANA timezone name', () => {
			const regex = /^[A-Za-z]+\/[A-Za-z_]+$/; // Basic regex for IANA timezone format
			const result = getCurrentTimezoneIANAName();
			expect(result).toMatch(regex);
		});

		test('current timezone should be included in the list of IANA names', () => {
			const currentTimezone = getCurrentTimezoneIANAName();
			const ianaNames = getIANANames();
			expect(ianaNames).toContain(currentTimezone);
		});
	});
});
