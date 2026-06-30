import { cn } from '@wanderlust/ui/lib/utils';
import React from 'react';

type Props<T> = {
	className?: string;
	data: T[];
	keyExtractor: (item: T) => string;
	renderItem: (item: T, className: string, index: number) => React.ReactNode;
	itemClassName?: string;
};

export function DenseList<T>({
	className,
	data,
	keyExtractor,
	renderItem,
	itemClassName = 'p-2 hover:bg-muted',
}: Props<T>) {
	return (
		<div
			className={cn('flex flex-col divide-y divide-border border', className)}
		>
			{data.map((item, index) => (
				<React.Fragment key={keyExtractor(item)}>
					{renderItem(item, itemClassName, index)}
				</React.Fragment>
			))}
		</div>
	);
}
