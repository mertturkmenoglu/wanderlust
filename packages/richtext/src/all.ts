import { extractHashtags } from './hashtags';
import { createLinkifyInstance } from './link';
import { extractMentions } from './mentions';
import type { Facet } from './types';

export function extractAllFacets(text: string): Facet[] {
	const mentions = extractMentions(text);
	const hashtags = extractHashtags(text);
	const linkify = createLinkifyInstance();
	const links = linkify.find(text);
	return [...mentions, ...hashtags, ...links];
}
