import { cn } from '@wanderlust/ui/lib/utils';
import { FormattedRating } from '@/components/formatted-rating';
import { useNumberFormatter } from '@/hooks/use-number-formatter';
import { computeRating } from '@/lib/rating';
import { AddReviewLink } from './add-review-link';
import { Filters } from './filters';
import { Graph } from './graph';
import { usePlaceQuery } from './hooks';

type Props = {
	className?: string;
};

export function Ratings({ className }: Props) {
	const query = usePlaceQuery();
	const place = query.data.place;
	const rating = computeRating(place.totalPoints, place.totalVotes);
	const numFmt = useNumberFormatter();

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
					<h3 className="font-bold text-primary text-xl">Reviews</h3>
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

					<AddReviewLink />
				</div>

				<Graph />

				<Filters />
			</div>
		</div>
	);
}
