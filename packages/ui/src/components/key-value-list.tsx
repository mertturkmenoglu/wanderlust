import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

export type KeyValueListItem = {
	label: ReactNode;
	value: ReactNode;
	description?: ReactNode;
};

export function KeyValueList({
	items,
	variant = 'default',
	className,
}: {
	items: KeyValueListItem[];
	variant?: 'default' | 'bordered';
	className?: string;
}) {
	return (
		<dl
			className={cn(
				'grid text-sm',
				variant === 'bordered' && 'overflow-hidden rounded-md border',
				className,
			)}
		>
			{items.map((item, index) => (
				<div
					key={index}
					className={cn(
						'grid gap-1 px-3 py-2 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4',
						variant === 'bordered' && index > 0 && 'border-t',
					)}
				>
					<dt className="text-muted-foreground">{item.label}</dt>
					<dd className="min-w-0 font-medium">
						<div className="truncate">{item.value}</div>
						{item.description ? (
							<div className="mt-1 font-normal text-muted-foreground text-xs">
								{item.description}
							</div>
						) : null}
					</dd>
				</div>
			))}
		</dl>
	);
}
