import { useLoaderData } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import { LoaderCircleIcon } from 'lucide-react';
import { FormattedRating } from '@/components/formatted-rating';
import { computeRating } from '@/lib/rating';
import { CreateReviewDialog } from './create/create-dialog';
import { Filters } from './filters';
import { numFmt, useRatingsQuery } from './hooks';
import { ReviewImages } from './images';
import { RatingsGraph } from './ratings-graph';

type Props = {
	className?: string;
};

export function RatingsSection({ className }: Props) {
	const { place } = useLoaderData({ from: '/p/$id/' });
	const rating = computeRating(place.totalPoints, place.totalVotes);
	const query = useRatingsQuery(place.id);

	return (
		<div className={cn(className)}>
			<div
				className={cn(
					'bg-linear-to-r from-accent/50 to-primary/10',
					'flex flex-col gap-8',
					'h-min rounded-md p-6',
				)}
			>
				<div>
					<h3 id="reviews" className="font-bold text-primary text-xl">
						Reviews
					</h3>
					<div className="my-2 flex items-center gap-4">
						<span className="font-bold text-6xl text-primary">{rating}</span>
						<div>
							<FormattedRating
								rating={Number.parseFloat(rating)}
								votes={place.totalVotes}
								showNumbers={false}
							/>
							<span className="text-muted-foreground text-xs tracking-tight">
								{numFmt.format(place.totalVotes)} reviews
							</span>
						</div>
					</div>
					<CreateReviewDialog />
				</div>

				{query.isLoading && (
					<LoaderCircleIcon className="mx-auto my-auto size-16 animate-spin text-primary" />
				)}

				{query.data && <RatingsGraph ratings={query.data} />}
				{query.data && <Filters />}
			</div>

			<div className="mt-4">
				<ReviewImages />
			</div>
		</div>
	);
}
