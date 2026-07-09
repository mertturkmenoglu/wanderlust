import type { Outputs } from '@/lib/orpc';

export type TRichTextFacet =
	Outputs['reviews']['get']['review']['facets'][number];

export type EnrichedTextProps = Omit<
	React.ComponentPropsWithoutRef<'div'>,
	'children'
> & {
	text: string;
	facets: TRichTextFacet[];
};

export type TEnrichedTextSegment = {
	text: string;
	facet?: TRichTextFacet;
};
