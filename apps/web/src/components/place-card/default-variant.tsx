import { Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Badge } from '@wanderlust/ui/components/badge';
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
import { useNumberFormatter } from '@/hooks/use-number-formatter';
import { ipx } from '@/lib/ipx';
import { usePlaceCardContext } from './context';
import {
	useAddToFavoritesMutation,
	useRemoveFromFavoritesMutation,
} from './hooks';
import type { Props } from './types';

export function DefaultVariant({
	className,
	variant = 'default',
	...props
}: Props) {
	const ctx = usePlaceCardContext();
	const numFmt = useNumberFormatter();

	const addMutation = useAddToFavoritesMutation();
	const removeMutation = useRemoveFromFavoritesMutation();

	return (
		<Card
			size="sm"
			className={cn('group @container relative', className)}
			{...props}
		>
			<Image
				src={ipx(ctx.asset.url, 'w_512')}
				alt={ctx.asset.description ?? ''}
				layout="constrained"
				aspectRatio={16 / 9}
				height={128}
				className="aspect-video w-full object-cover"
			/>
			{ctx.place.accolades.length > 0 && (
				<HoverCard>
					<HoverCardTrigger asChild>
						<div className="absolute top-2 left-2 z-10 flex items-center rounded-full bg-white p-2">
							<AwardIcon className="fill-white text-primary" />
						</div>
					</HoverCardTrigger>
					<HoverCardContent
						align="center"
						side="right"
						className="flex flex-col gap-2 p-2"
					>
						{ctx.place.accolades.map((acc) => (
							<Link
								key={acc.id}
								to="/a/$id"
								params={{ id: acc.accolade.id }}
								className="flex"
							>
								<Badge variant="warning">
									<AwardIcon />
									{acc.accolade.title}
								</Badge>
							</Link>
						))}
					</HoverCardContent>
				</HoverCard>
			)}
			{ctx.meta && (
				<button
					type="button"
					className="absolute top-2 right-2 z-10 rounded-full bg-background/80 p-2 transition-colors hover:bg-background/90"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();

						if (ctx.meta?.isFavorite) {
							removeMutation.mutate({ placeId: ctx.place.id });
						} else {
							addMutation.mutate({ placeId: ctx.place.id });
						}
					}}
				>
					<HeartIcon
						className={cn({
							'fill-primary text-primary': ctx.meta?.isFavorite,
							'fill-muted text-muted-foreground': !ctx.meta?.isFavorite,
						})}
					/>
				</button>
			)}
			<CardHeader>
				{ctx.rating !== '0.0' && (
					<CardAction>
						<Badge variant="default" size="default" className="ml-auto w-fit">
							{ctx.rating} <StarIcon className="fill-white text-white" />
							<span className="text-white/70 text-xs leading-px tracking-tighter">
								({numFmt.format(ctx.place.totalVotes)})
							</span>
						</Badge>
					</CardAction>
				)}
				<CardTitle className="line-clamp-1">{ctx.place.name}</CardTitle>
				<CardDescription className="line-clamp-1">
					{ctx.place.address.city.name} / {ctx.place.address.city.countryName}
				</CardDescription>
				<CardDescription className="line-clamp-1 text-primary">
					{ctx.place.category.name}
				</CardDescription>
			</CardHeader>
		</Card>
	);
}
