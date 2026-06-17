import { cn } from '@wanderlust/ui/lib/utils';
import React, { useMemo } from 'react';
import { interleave } from '@/lib/interleave';

export type InterleaveRendererProps = {
	listA: React.ReactNode[];
	listB: React.ReactNode[];
	className?: string;
};

const InterleaveRenderer = React.memo(function InterleaveRenderer({
	listA,
	listB,
	className,
}: InterleaveRendererProps) {
	const elements = useMemo(() => interleave(listA, listB), [listA, listB]);

	return (
		<div className={cn(className)}>
			{elements.map((element, index) => (
				<React.Fragment key={index}>{element}</React.Fragment>
			))}
		</div>
	);
});

function skip(count: number): React.ReactNode[] {
	return new Array(count).fill(null);
}

export function useInterleaveRenderer() {
	return {
		Renderer: InterleaveRenderer,
		skip,
	};
}
