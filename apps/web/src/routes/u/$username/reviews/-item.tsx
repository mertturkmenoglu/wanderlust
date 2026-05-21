import { Link } from '@tanstack/react-router';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { formatDistanceToNow } from 'date-fns';
import { FormattedRating } from '@/components/formatted-rating';
import type { Outputs } from '@/lib/orpc';
import { toTitleCase } from '@/lib/text';

type Props = {
	review: Outputs['reviews']['get']['review'];
};

export function ReviewItem({ review }: Props) {
	return (
		<Link
			to="/p/$id/reviews/$reviewId"
			params={{
				id: review.placeId,
				reviewId: review.id,
			}}
		>
			<Item variant="outline" className="hover:bg-muted">
				<ItemMedia variant="default" className="flex flex-col">
					<FormattedRating
						rating={review.rating}
						votes={1}
						showNumbers={false}
						starsClassName="size-3"
						className="col-span-3 md:col-span-1"
					/>
					<span className="text-muted-foreground text-xs tracking-tighter">
						{review.rating} stars
					</span>
				</ItemMedia>
				<ItemContent>
					<ItemTitle>{review.place.name}</ItemTitle>
					<ItemDescription>{review.content}</ItemDescription>
				</ItemContent>
				<ItemActions>
					<span className="text-muted-foreground text-xs tracking-tighter">
						{toTitleCase(`${formatDistanceToNow(review.createdAt)} ago`)}
					</span>
				</ItemActions>
			</Item>
		</Link>
	);
}
