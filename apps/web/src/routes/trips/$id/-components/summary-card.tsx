import type { LinkOptions } from '@tanstack/react-router';
import { Card, CardContent } from '@wanderlust/ui/components/card';
import { cn } from '@wanderlust/ui/lib/utils';
import type { ChevronRightIcon } from 'lucide-react';

export type SummaryCardProps = {
	title: string;
	value: string | number;
	color: string;
	icon: typeof ChevronRightIcon;
	explain: string;
	link: LinkOptions;
	className?: string;
};

export function SummaryCard({
	title,
	value,
	color,
	icon: Icon,
	className,
}: SummaryCardProps) {
	return (
		<Card size="sm" className={cn(className)}>
			<CardContent className="flex flex-row items-start justify-between p-4">
				<div>
					<dt className="font-medium text-muted-foreground text-sm">{title}</dt>
					<dd className="line-clamp-2 h-16 font-semibold text-3xl text-foreground tabular-nums">
						{value}
					</dd>
				</div>

				<Icon className={cn('size-6', color)} />
			</CardContent>
		</Card>
	);
}
