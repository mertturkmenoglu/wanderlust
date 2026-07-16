import type { Facet } from './types';

export function extractHashtags(text: string): Facet[] {
	const regex = /\B#\w+\b/gu;
	const matches = text.matchAll(regex);
	const facets: Facet[] = [];

	for (const match of matches) {
		if (match.index !== undefined) {
			const tag = match[0];
			const start = match.index;
			const end = start + tag.length;

			facets.push({
				type: 'hashtag',
				value: tag,
				start,
				end,
			});
		}
	}

	return facets;
}
