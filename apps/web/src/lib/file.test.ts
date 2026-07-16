import { describe, expect, test } from 'vitest';
import { humanFileSize } from './file';

describe('Lib/File', () => {
	test('should handle 0 bytes', () => {
		const input = 0;
		const expectedOutput = '0 B';
		expect(humanFileSize(input)).toBe(expectedOutput);
	});

	test('should handle bytes less than 1 KB', () => {
		const input = 512;
		const expectedOutput = '512 B';
		expect(humanFileSize(input)).toBe(expectedOutput);
	});

	test('should handle bytes in KB', () => {
		const input = 2048;
		const expectedOutput = '2.0 KiB';
		expect(humanFileSize(input)).toBe(expectedOutput);
	});

	test('should handle bytes in MB', () => {
		const input = 5 * 1024 * 1024; // 5 MB
		const expectedOutput = '5.0 MiB';
		expect(humanFileSize(input)).toBe(expectedOutput);
	});

	test('should handle bytes in GB', () => {
		const input = 3 * 1024 * 1024 * 1024; // 3 GB
		const expectedOutput = '3.0 GiB';
		expect(humanFileSize(input)).toBe(expectedOutput);
	});

	test('should format correctly with SI units', () => {
		const input = 1500; // 1.5 KB in SI units
		const expectedOutput = '1.5 kB';
		expect(humanFileSize(input, true)).toBe(expectedOutput);
	});

	test('should format correctly with specified decimal places', () => {
		const input = 1536; // 1.5 KiB
		const expectedOutput = '1.50 KiB';
		expect(humanFileSize(input, false, 2)).toBe(expectedOutput);
	});
});
