import { nanoid } from '@wanderlust/uid';

export function generateRandomUsername(length = 16): string {
	let username = '';

	do {
		username = nanoid(length);
	} while (isNumericChar(username[0] ?? '0'));

	return username;
}

function isNumericChar(char: string): boolean {
	return /^[0-9]$/.test(char);
}

export function withRandomSuffix(username: string, length = 6): string {
	const suffix = nanoid(length);
	return `${username.slice(0, 20 - length)}${suffix}`;
}
