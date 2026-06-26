import { Link, type LinkOptions } from '@tanstack/react-router';
import { Card, CardContent, CardFooter } from '@wanderlust/ui/components/card';
import { cn } from '@wanderlust/ui/lib/utils';
import { ChevronRightIcon } from 'lucide-react';

export type SummaryCardProps = {
	title: string;
	value: string | number;
	color: string;
	icon: typeof ChevronRightIcon;
	explain: string;
	link: LinkOptions;
};

export function SummaryCard({
	title,
	value,
	color,
	icon: Icon,
	explain,
	link,
}: SummaryCardProps) {
	return (
		<Card key="key" className="">
			<CardContent className="flex flex-row items-start justify-between p-6">
				<div>
					<dt className="font-medium text-muted-foreground text-sm">{title}</dt>
					<dd className="lineline-clamp-2 h-16 font-semibold text-3xl text-foreground tabular-nums">
						{value}
					</dd>
				</div>

				<Icon className={cn('size-6', color)} />
			</CardContent>
			<CardFooter>
				<Link
					{...link}
					className="flex w-full items-center justify-between gap-1"
				>
					<span>{explain}</span>
					<ChevronRightIcon className="text-primary" />
				</Link>
			</CardFooter>
		</Card>
	);
}
