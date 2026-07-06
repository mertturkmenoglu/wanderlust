import { skipToken, useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Badge } from '@wanderlust/ui/components/badge';
import { Button } from '@wanderlust/ui/components/button';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@wanderlust/ui/components/hover-card';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemFooter,
	ItemHeader,
} from '@wanderlust/ui/components/item';
import { Spinner } from '@wanderlust/ui/components/spinner';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@wanderlust/ui/components/tooltip';
import { cn } from '@wanderlust/ui/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { LanguagesIcon, StarIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CollapsibleText } from '@/components/collapsible-text';
import { FormattedRating } from '@/components/formatted-rating';
import { UserImage } from '@/components/user-image';
import { useAssetLightbox } from '@/hooks/use-asset-lightbox';
import { ipx } from '@/lib/ipx';
import { type Outputs, orpc } from '@/lib/orpc';
import { UserCard } from '../user-card';
import { useLikeReviewMutation, useLikesFormatter } from './hooks';
import { Menu } from './menu';

type Props = {
	className?: string;
	review: Outputs['reviews']['listByPlaceId']['reviews'][number];
};

export function ReviewCard({ review: { review, meta }, className }: Props) {
	const [open, setOpen] = useState(false);

	const lb = useAssetLightbox(review.assets);
	const likeMutation = useLikeReviewMutation();
	const fmt = useLikesFormatter();
	const languageDisplayNames = new Intl.DisplayNames(['en'], {
		type: 'language',
	});
	const lang = useMemo(() => {
		if (review.detectedLanguage === null) {
			return null;
		}

		return languageDisplayNames.of(review.detectedLanguage) ?? null;
	}, [review.detectedLanguage, languageDisplayNames]);

	const query = useQuery(
		orpc.users.get.queryOptions({
			input: open
				? {
						username: review.user.username,
					}
				: skipToken,
			staleTime: 5 * 60 * 1000, // avoid refetching every hover
		}),
	);

	return (
		<Item variant="default" className={cn('px-0', className)} size="sm">
			<ItemHeader>
				<div className="flex items-center gap-4">
					<HoverCard open={open} onOpenChange={setOpen}>
						<HoverCardTrigger delay={200}>
							<UserImage
								className="size-14 rounded-full"
								src={review.user.image ?? ''}
							/>
						</HoverCardTrigger>
						<HoverCardContent className="p-0">
							{query.isError && (
								<div className="text-center text-muted-foreground text-xs">
									An error occurred.
								</div>
							)}
							{query.isLoading && <Spinner />}
							{query.data && (
								<UserCard profile={query.data.profile} meta={query.data.meta} />
							)}
						</HoverCardContent>
					</HoverCard>

					<div>
						<Link
							to="/u/$username"
							params={{
								username: review.user.username,
							}}
						>
							<div className="font-medium">{review.user.name}</div>
							<div className="text-primary text-xs tracking-tight">
								<span className="">@{review.user.username}</span>
							</div>
						</Link>
						<Link
							to="/p/$id/reviews/$reviewId"
							params={{
								id: review.placeId,
								reviewId: review.id,
							}}
							className="mt-1 text-muted-foreground text-xs hover:underline"
						>{`${formatDistanceToNow(review.createdAt)} ago`}</Link>
					</div>
				</div>

				<ItemActions className="flex-flex-row items-center">
					{lang && (
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="ghost" size="icon-sm">
									<LanguagesIcon className="size-3.5 sm:size-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								Detected language: {lang} (
								{review.detectedLanguage?.toUpperCase()})
							</TooltipContent>
						</Tooltip>
					)}
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
			<ItemFooter className="flex flex-row items-center gap-4">
				<div className="flex items-center gap-2">
					<FormattedRating
						rating={review.rating}
						votes={1}
						showNumbers={false}
						starsClassName="size-3 sm:size-4"
					/>
					<span className="font-semibold text-xs sm:text-sm">
						{review.rating}.0
					</span>
				</div>

				<div className="flex flex-row items-center gap-2">
					<div
						className="text-muted-foreground text-xs"
						title={`Visited on ${format(review.visitedAt, 'PPP')}`}
					>
						<span className="sr-only sm:not-sr-only">Visited on </span>
						{format(review.visitedAt, 'PPP')}
					</div>

					<button
						type="button"
						className="ml-auto"
						title={meta.isLiked ? 'Unlike' : 'Like'}
						disabled={likeMutation.isPending}
						onClick={() => likeMutation.mutate({ id: review.id })}
					>
						<Badge
							variant={meta.isLiked ? 'default' : 'outline'}
							className="gap-1"
						>
							<StarIcon className="size-3 sm:size-4" />
							{fmt(review.totalLikes)}
						</Badge>
					</button>
				</div>
			</ItemFooter>
		</Item>
	);
}
