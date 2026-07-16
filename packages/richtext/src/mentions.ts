import type { Facet } from './types';

export function extractMentions(text: string): Facet[] {
	const regex = /\B@[a-zA-Z]\w{3,}\b/gu;
	const matches = text.matchAll(regex);
	const facets: Facet[] = [];

	for (const match of matches) {
		if (match.index !== undefined) {
			const mention = match[0];
			const start = match.index;
			const end = start + mention.length;

			facets.push({
				type: 'mention',
				value: mention,
				start,
				end,
			});
		}
	}

	return facets;
}
