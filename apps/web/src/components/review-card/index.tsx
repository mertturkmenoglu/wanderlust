import { Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemFooter,
	ItemHeader,
} from '@wanderlust/ui/components/item';
import { cn } from '@wanderlust/ui/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { CollapsibleText } from '@/components/collapsible-text';
import { FormattedRating } from '@/components/formatted-rating';
import { UserImage } from '@/components/user-image';
import { useAssetLightbox } from '@/hooks/use-asset-lightbox';
import { ipx } from '@/lib/ipx';
import type { Outputs } from '@/lib/orpc';
import { Menu } from './menu';

type Props = {
	className?: string;
	review: Outputs['reviews']['listByPlaceId']['reviews'][number];
};

export function ReviewCard({ review, className }: Props) {
	const lb = useAssetLightbox(review.assets);

	return (
		<Item variant="default" className={cn(className)} size="sm">
			<ItemHeader>
				<Link
					to="/u/$username"
					params={{
						username: review.user.username,
					}}
					className="flex items-center gap-4"
				>
					<UserImage
						className="size-16 rounded-full"
						src={review.user.image ?? ''}
					/>
					<div>
						<div className="font-medium">{review.user.name}</div>
						<div className="text-primary text-xs tracking-tight">
							<span className="">@{review.user.username}</span>
						</div>
						<Link
							to="/p/$id/reviews/$reviewId"
							params={{
								id: review.placeId,
								reviewId: review.id,
							}}
							className="mt-1 text-muted-foreground text-xs hover:underline"
						>{`${formatDistanceToNow(review.createdAt)} ago`}</Link>
					</div>
				</Link>

				<ItemActions>
					<Menu review={review} />
				</ItemActions>
			</ItemHeader>
			<ItemContent>
				<CollapsibleText text={review.content} charLimit={512} />
				<div
					className={cn('flex items-center gap-4', {
						'mt-4': review.assets.length > 0,
					})}
				>
					{review.assets.map((m, i) => (
						<button type="button" key={m.url} onClick={() => lb.openAt(i)}>
							<Image
								src={ipx(m.url, 'w_96')}
								alt=""
								className="aspect-video rounded object-cover"
								layout="constrained"
								width={96}
								aspectRatio={1}
							/>
						</button>
					))}
				</div>
				<lb.Component />
			</ItemContent>
			<ItemFooter>
				<div className="flex items-center gap-2">
					<FormattedRating
						rating={review.rating}
						votes={1}
						showNumbers={false}
					/>
					<span className="font-semibold text-sm">{review.rating}.0</span>
				</div>
				<div className="text-muted-foreground text-xs">
					Visited on {format(review.visitedAt, 'PPP')}
				</div>
			</ItemFooter>
		</Item>
	);
}
