import { normalizeAndSlugify } from './normalize';
import { generateRandomUsername, withRandomSuffix } from './random';
import { isValidUsername } from './valid';

export function generateUsernameFromEmail(email: string): string {
	const local = email.split('@')[0];

	if (!local) {
		return generateRandomUsername();
	}

	let candidate = local;

	let isValid = isValidUsername(local);

	// If the local part is valid, we can return it with a random suffix to ensure uniqueness
	if (isValid) {
		return withRandomSuffix(candidate);
	}

	// Otherwise, we normalize and slugify the local part to create a new candidate
	candidate = normalizeAndSlugify(candidate);
	candidate = withRandomSuffix(candidate);

	isValid = isValidUsername(candidate);

	// Check if the new candidate is valid
	// If it is, we return it; otherwise, we fall back to generating a random username
	if (isValid) {
		return candidate;
	}

	return generateRandomUsername();
}
