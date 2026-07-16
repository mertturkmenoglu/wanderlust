import { describe, expect, test } from 'vitest';
import { userImage } from './image';

describe('Lib/Image', () => {
	describe('userImage', () => {
		describe('globalThis.window is defined', () => {
			test('should handle null case', () => {
				const input = null;
				const result = userImage(input);
				const expected = `${globalThis.window.location.origin}/profile.png`;
				expect(result).toBe(expected);
			});

			test('should handle string starting with //', () => {
				const input = '//example.com/image.png';
				const result = userImage(input);
				const expected = globalThis.window.location.protocol + input;
				expect(result).toBe(expected);
			});

			test('should handle other strings', () => {
				const input = 'https://example.com/image.png';
				const result = userImage(input);
				expect(result).toBe(input);
			});
		});
	});
});
