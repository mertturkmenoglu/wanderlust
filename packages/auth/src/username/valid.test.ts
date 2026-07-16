import { describe, expect, test } from 'vitest';
import { isValidUsername } from './valid';

describe('username validity', () => {
	test.for([
		'alice',
		'alice123',
		'Alice_123',
		'alice_bella',
		'AliceTwentyChars1234',
		'kate',
	])('username should be valid: %s', (username) => {
		expect(isValidUsername(username)).toBe(true);
	});

	test.for([
		['empty string', ''],
		['too short', 'abc'],
		['too long', 'a'.repeat(21)],
		['starts with number', '1alice'],
		['starts with underscore', '_alice'],
		['ends with underscore', 'alice_'],
		['contains special character', 'alice!'],
		['contains space', 'alice bella'],
		['contains two consecutive underscores', 'alice__bella'],
		['username is not string', 12345],
		['contains unicode characters', 'alice😊'],
		['contains the word wanderlust', 'wanderlustUser'],
		['contains the word Wanderlust', 'WanderlustUser'],
		['contains the word WaNdErLuSt', 'WaNdErLuStUser'],
		['reserved username', 'admin'],
		['reserved username case insensitive', 'Admin'],
	])('username should be invalid: %s', ([, username]) => {
		if (username === undefined) {
			expect.fail('Username is undefined');
		}

		// Cast to ignore TypeScript error for non-string types, since the function expects a string.
		expect(isValidUsername(username as string)).toBe(false);
	});
});
