import { describe, expect, test } from 'vitest';
import { generateUsernameFromEmail } from './email';
import { isValidUsername } from './valid';

describe('Auth/Username Email', () => {
	test.for([
		'alice@example.com',
		'bella@example.com',
		'clara_doe@example.com',
		'su@example.com',
		'AliceTest@example.com',
	])('happy path: generated username starts with local part of email: %s', (email) => {
		const local = email.split('@')[0];
		const username = generateUsernameFromEmail(email);
		expect(isValidUsername(username)).toBe(true);
		expect(username.startsWith(local)).toBe(true);
	});

	test.for([
		'José@example.com',
		'bella-swan@example.com',
		'123alice@example.com',
		'AliceHasAVeryLongEmailAddress@example.com',
	])('unhappy path: local part of email is invalid and generates a random username: %s', (email) => {
		const local = email.split('@')[0];
		const username = generateUsernameFromEmail(email);
		expect(isValidUsername(username)).toBe(true);
		expect(username.startsWith(local)).toBe(false);
	});
});
