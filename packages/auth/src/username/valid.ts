import { reservedUsernames } from './reserved';

/**
 * This regex checks for the following conditions:
 *
 * 1. The username must start with a letter (either uppercase or lowercase).
 * 2. The username can contain letters, numbers, and underscores.
 * 3. The username must be between 4 and 20 characters long.
 * 4. The username cannot contain two consecutive underscores.
 *
 * Negative lookahead is used to ensure that there are no two consecutive underscores in the username.
 *
 * First character class ensures that the username starts with a letter.
 *
 * Then, any word character (a-z, A-Z, 0-9, _) can follow 2 to 18 times.
 *
 * Then, the last character class ensures that the last character is a letter or a number.
 */
const usernameValidationRegex = /^(?!.*__)[a-zA-Z]\w{2,18}[a-zA-Z0-9]$/;

export function isValidUsername(username: string): boolean {
	if (typeof username !== 'string') {
		return false;
	}

	// Check if the username is in the reserved usernames list (case-insensitive)
	if (reservedUsernames.includes(username.toLowerCase())) {
		return false;
	}

	// Check if the username contains the word "wanderlust" (case-insensitive)
	if (username.match(/wanderlust/i) !== null) {
		return false;
	}

	return usernameValidationRegex.test(username);
}
