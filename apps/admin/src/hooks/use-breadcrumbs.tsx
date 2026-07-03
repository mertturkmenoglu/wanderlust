import { isMatch, useMatches } from '@tanstack/react-router';

export function useBreadcrumbs() {
	const matches = useMatches();
	const lastMatch = matches.at(-1);

	if (!lastMatch) {
		return [];
	}

	if (isMatch(lastMatch, 'staticData') && lastMatch.staticData.breadcrumbs) {
		const { breadcrumbs } = lastMatch.staticData;

		if (breadcrumbs !== undefined) {
			const items = breadcrumbs(lastMatch.loaderData);
			return items;
		}
	}

	return [];
}
