import { Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Badge } from '@wanderlust/ui/components/badge';
import { Button, buttonVariants } from '@wanderlust/ui/components/button';
import {
	Card,
	CardAction,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@wanderlust/ui/components/card';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@wanderlust/ui/components/hover-card';
import { cn } from '@wanderlust/ui/lib/utils';
import { AwardIcon, HeartIcon, StarIcon } from 'lucide-react';
import {
	useAddToFavoritesMutation,
	useRemoveFromFavoritesMutation,
} from './hooks';
import { usePlaceStore } from './store';
import type { Props } from './types';

export function DefaultVariant({
	className,
	variant = 'default',
	...props
}: Props) {
	const asset = usePlaceStore((s) => s.asset);
	const place = usePlaceStore((s) => s.place);
	const meta = usePlaceStore((s) => s.meta);
	const rating = usePlaceStore((s) => s.rating);

	const addMutation = useAddToFavoritesMutation();
	const removeMutation = useRemoveFromFavoritesMutation();

	return (
		<Card
			size="sm"
			className={cn('group @container relative', className)}
			{...props}
		>
			<Image
				src={asset.url}
				alt={asset.alt ?? ''}
				layout="constrained"
				aspectRatio={16 / 9}
				height={128}
				className="aspect-video w-full object-cover"
			/>
			{place.accolades.length > 0 && (
				<HoverCard>
					<HoverCardTrigger
						render={
							<div
								className={buttonVariants({
									variant: 'warning',
									size: 'icon',
									className: 'absolute top-2 left-2 z-10',
								})}
							>
								<AwardIcon />
							</div>
						}
					/>
					<HoverCardContent className="flex flex-col gap-2 p-2">
						{place.accolades.map((acc) => (
							<Link
								key={acc.id}
								to="/accolades/$id"
								params={{ id: acc.id }}
								className="flex"
							>
								<Badge variant="warning">
									<AwardIcon />
									{acc.title}
								</Badge>
							</Link>
						))}
					</HoverCardContent>
				</HoverCard>
			)}
			{meta && (
				<Button
					type="button"
					size="icon"
					variant="secondary"
					className="absolute top-2 right-2 z-10"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();

						if (meta?.isFavorite) {
							removeMutation.mutate({ placeId: place.id });
						} else {
							addMutation.mutate({ placeId: place.id });
						}
					}}
				>
					<HeartIcon
						className={cn({
							'fill-primary text-primary': meta?.isFavorite,
							'fill-muted text-muted-foreground': !meta?.isFavorite,
						})}
					/>
				</Button>
			)}
			<CardHeader>
				{rating !== 0 && (
					<CardAction>
						<Badge variant="default" size="default" className="ml-auto w-fit">
							<span className="text-white">{rating.toFixed(1)}</span>{' '}
							<StarIcon className="fill-white text-white" />
						</Badge>
					</CardAction>
				)}
				<CardTitle className="line-clamp-1">{place.name}</CardTitle>
				<CardDescription className="line-clamp-1">
					{place.locality} / {place.adminAreaName}
				</CardDescription>
				<CardDescription className="line-clamp-1 text-primary">
					{place.primaryCategory.displayName}
				</CardDescription>
			</CardHeader>
		</Card>
	);
}
