import { Link } from '@tanstack/react-router';
import { formatDistanceToNow } from 'date-fns';
import { FormattedRating } from '@/components/kit/formatted-rating';
import { Separator } from '@/components/ui/separator';
import type { components } from '@/lib/api-types';

type Props = {
	review: components['schemas']['Review'];
	isLast: boolean;
};

export function Card({ review, isLast }: Props) {
	return (
		<Link
			to="/p/$id"
			params={{
				id: review.placeId,
			}}
			className="block space-y-4"
		>
			<div className="grid grid-cols-12">
				<div className="col-span-10 grid grid-cols-12 items-center">
					<span className="hidden lg:col-span-1 lg:block">Reviewed </span>
					<span className="col-span-6 text-primary md:col-span-4 lg:mx-4">
						{review.place.name}
					</span>
					<FormattedRating
						rating={review.rating}
						votes={1}
						showNumbers={false}
						starsClassName="size-3"
						className="col-span-3 md:col-span-1"
					/>
					<span className="col-span-2 ml-2 text-sm md:col-span-1">
						{review.rating} stars
					</span>
					<span className="ml-2 hidden text-xs md:col-span-5 md:block">
						{`${review.content.slice(0, 50)}...`}
					</span>
				</div>
				<span className="col-span-2 ml-auto text-right text-sm">
					{formatDistanceToNow(review.createdAt)} ago
				</span>
			</div>
			{!isLast && <Separator />}
		</Link>
	);
}
