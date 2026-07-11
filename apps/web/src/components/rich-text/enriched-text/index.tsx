import { cn } from '@wanderlust/ui/lib/utils';
import React from 'react';
import { renderSegment } from './renderers';
import type { EnrichedTextProps } from './types';
import { useSegments } from './use-segments';

export function EnrichedText({
	text,
	facets,
	className,
	...props
}: EnrichedTextProps) {
	const segments = useSegments(text, facets);

	return (
		<div className={cn('inline', className)} {...props}>
			{segments.map((segment) => (
				<React.Fragment key={`segment-${segment.text}`}>
					{renderSegment(segment)}
				</React.Fragment>
			))}
		</div>
	);
}
