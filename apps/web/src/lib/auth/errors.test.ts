import { describe, expect, test } from 'vitest';
import { isAuthError } from './errors';

describe('Lib/Auth/Errors', () => {
	const err = {
		error: {
			code: 'some_error_code',
		},
		status: 400, // Arbitrary status code for testing
		message: 'Some error message',
	};

	test('isAuthError should return true for valid AuthError', () => {
		expect(isAuthError(err)).toBe(true);
	});

	test('isAuthError should return false for default Error object', () => {
		expect(isAuthError(new Error('Some error message'))).toBe(false);
	});
});
