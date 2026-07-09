import { useMemo } from 'react';
import type { TEnrichedTextSegment, TRichTextFacet } from './types';

export function useSegments(text: string, facets: TRichTextFacet[]) {
	return useMemo(() => {
		const segments: TEnrichedTextSegment[] = [];
		const sortedFacets = [...facets].sort((a, b) => a.start - b.start);

		let lastIndex = 0;

		for (const facet of sortedFacets) {
			if (facet.start > lastIndex) {
				segments.push({ text: text.slice(lastIndex, facet.start) });
			}

			segments.push({ text: text.slice(facet.start, facet.end), facet });
			lastIndex = facet.end;
		}

		if (lastIndex < text.length) {
			segments.push({ text: text.slice(lastIndex) });
		}

		return segments;
	}, [text, facets]);
}
