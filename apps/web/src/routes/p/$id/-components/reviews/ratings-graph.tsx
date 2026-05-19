import { Progress } from '@wanderlust/ui/components/progress';
import { StarIcon } from 'lucide-react';
import type { Outputs } from '@/lib/orpc';
import { numFmt } from './hooks';

type Props = {
	ratings: Outputs['reviews']['getRatings'];
};

export function RatingsGraph({ ratings }: Props) {
	const entries = Object.entries(ratings.ratings).map(
		(v) => [+v[0], v[1]] as const,
	);
	const sorted = entries.sort((a, b) => b[0] - a[0]);

	return (
		<div className="w-full space-y-2">
			{sorted.map(([rating, count]) => (
				<div
					key={rating}
					className="grid grid-cols-12 items-center gap-2 text-right"
				>
					<div className="flex items-center justify-end gap-1 font-medium text-primary text-sm">
						{rating} <StarIcon className="size-3 fill-primary text-primary" />
					</div>
					<Progress
						value={(count * 100) / ratings.totalVotes}
						className="col-span-10"
					/>
					<span className="col-span-1 text-primary text-xs tabular-nums">
						({numFmt.format(count)})
					</span>
				</div>
			))}
		</div>
	);
}
