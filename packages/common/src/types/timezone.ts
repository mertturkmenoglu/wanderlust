import { z } from 'zod';

export const Timezone = z
	.string()
	.min(1)
	.max(63)
	.refine(isValidIANATimezone, {
		error: 'Invalid IANA timezone name',
	})
	.meta({
		description: 'IANA timezone name',
		examples: ['Europe/London', 'America/New_York'],
	});

function isValidIANATimezone(tz: string): boolean {
	// As of July '26, Intl support for Etc region is not consistent.
	// Checking for these values explicitly.
	if (tz === 'UTC' || tz === 'Etc/UTC' || tz === 'Etc/GMT') {
		return true;
	}

	try {
		Intl.DateTimeFormat(undefined, { timeZone: tz });
		return true;
	} catch {
		return false;
	}
}
