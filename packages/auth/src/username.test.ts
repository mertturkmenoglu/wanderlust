import { describe, expect, test } from 'vitest';
import { generateUsernameFromEmail } from './username';

describe('Auth/Username', () => {
	test.for([
		'alice@example.com',
		'bella@example.com',
		'clara_doe@example.com',
	])('happy path: generateUsernameFromEmail(%s)', (email) => {
		const username = generateUsernameFromEmail(email);
		expect(username).toMatch(/^[a-zA-Z]\w{3,31}$/);
		expect(username.length).toBeGreaterThan(4);
	});

	test.for([
		'su@example.com',
		'',
		'AliceTest@example.com',
		'José@example.com',
		'bella-swan@example.com',
		'123alice@example.com',
		'AliceHasAVeryLongEmailAddress@example.com',
	])('unhappy path: generateUsernameFromEmail(%s)', (email) => {
		const username = generateUsernameFromEmail(email);
		expect(username).toMatch(/^[a-zA-Z]\w{3,31}$/);
		expect(username.length).toBeGreaterThan(4);
	});
});
