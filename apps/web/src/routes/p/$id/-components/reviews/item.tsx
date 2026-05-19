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
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import { CollapsibleText } from '@/components/collapsible-text';
import { FormattedRating } from '@/components/formatted-rating';
import { UserImage } from '@/components/user-image';
import { ipx } from '@/lib/ipx';
import type { Outputs } from '@/lib/orpc';
import { Menu } from './menu';

type Props = {
	review: Outputs['reviews']['listByPlaceId']['reviews'][number];
};

export function ReviewItem({ review }: Props) {
	const [open, setOpen] = useState(false);
	const [index, setIndex] = useState(0);

	return (
		<Item variant="default">
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
						<div className="mt-1 text-muted-foreground text-xs">{`${formatDistanceToNow(
							review.createdAt,
						)} ago`}</div>
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
						<button
							type="button"
							key={m.url}
							onClick={() => {
								setIndex(() => {
									setOpen(true);
									return i;
								});
							}}
						>
							<Image
								src={ipx(m.url, 'w_96')}
								alt=""
								className="aspect-square rounded"
								layout="constrained"
								width={96}
								aspectRatio={1}
							/>
						</button>
					))}
				</div>
				<Lightbox
					open={open}
					close={() => setOpen(false)}
					slides={review.assets.map((m) => ({
						src: m.url,
					}))}
					carousel={{
						finite: true,
					}}
					controller={{
						closeOnBackdropClick: true,
					}}
					styles={{
						container: {
							backgroundColor: 'rgba(0, 0, 0, 0.8)',
						},
					}}
					index={index}
				/>
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
			</ItemFooter>
		</Item>
	);
}
