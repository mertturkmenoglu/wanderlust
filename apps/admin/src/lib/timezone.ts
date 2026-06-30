import { format } from 'date-fns';

// I don't know why but Intl implementations don't return Etc/UTC
// in the list of supported timezones, so we check if Etc/UTC is included
// in the return value of Intl.supportedValuesOf("timeZone") and if not, we add it to the list.
// JSCore and Spidermonkey returns UTC but we want Etc/UTC to be the default timezone for the application, so we add it to the list if it's not included.
export function getIANANames(): string[] {
	const ianaNames = Intl.supportedValuesOf('timeZone');

	if (!ianaNames.includes('Etc/UTC')) {
		ianaNames.push('Etc/UTC');
		return ianaNames.sort();
	}

	return ianaNames;
}

export function getCurrentTimezoneOffset(withUtcPrefix = true) {
	const offset = format(new Date(), 'xxx');
	return withUtcPrefix ? `UTC${offset}` : offset;
}

export function stripUTCPrefix(offsetWithUtcPrefix: string) {
	return offsetWithUtcPrefix.replace(/^UTC/, '');
}

export function getCurrentTimezoneIANAName() {
	const ianaTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	return ianaTimezone;
}
