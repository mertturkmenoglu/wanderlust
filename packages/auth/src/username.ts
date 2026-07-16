import slugify from '@sindresorhus/slugify';
import { nanoid } from '@wanderlust/uid';

export function generateRandomUsername(length = 10): string {
	let username = '';

	do {
		username = nanoid(length);
	} while (isNumericChar(username[0] ?? '0'));

	return username;
}

function isNumericChar(char: string): boolean {
	return /^[0-9]$/.test(char);
}

export function generateUsernameFromEmail(email: string): string {
	const username = email.split('@')[0];

	if (!username) {
		return generateRandomUsername();
	}

	if (username.length === 0 || isNumericChar(username[0] ?? '0')) {
		return generateRandomUsername();
	}

	const normalized = slugify(username, {
		separator: '_',
		transliterate: true,
	});

	// If the username is valid, append a random suffix to ensure uniqueness
	return normalized.slice(0, 27) + nanoid(5);
}
