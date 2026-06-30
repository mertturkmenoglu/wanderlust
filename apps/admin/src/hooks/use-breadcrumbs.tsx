import { isMatch, useMatches } from '@tanstack/react-router';

export function useBreadcrumbs() {
	const matches = useMatches();

	const crumbs = matches
		.filter((m) => isMatch(m, 'staticData'))
		.map((m) => {
			const { breadcrumb } = m.staticData;
			const label =
				typeof breadcrumb === 'function'
					? breadcrumb(m.loaderData)
					: breadcrumb;
			return { label: label ?? '-', path: m.pathname };
		});

	return crumbs;
}
