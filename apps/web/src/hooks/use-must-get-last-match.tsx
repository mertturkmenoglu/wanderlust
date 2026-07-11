import { useMatches } from '@tanstack/react-router';

export function useMustGetLastMatch() {
	const matches = useMatches();
	const lastMatch = matches.at(-1);

	if (!lastMatch) {
		throw new Error('useMustGetLastMatch: No matches found');
	}

	return lastMatch;
}
