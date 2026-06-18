import { Image } from '@unpic/react';
import { Badge } from '@wanderlust/ui/components/badge';
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@wanderlust/ui/components/card';
import { cn } from '@wanderlust/ui/lib/utils';
import { HeartIcon, StarIcon } from 'lucide-react';
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
		<Card size="sm" className={cn('group @container', className)} {...props}>
			<Image
				src={ipx(ctx.asset.url, 'w_512')}
				alt={ctx.asset.description ?? ''}
				layout="constrained"
				aspectRatio={16 / 9}
				height={128}
				className="aspect-video w-full object-cover"
			/>
			<CardHeader className="">
				{ctx.meta && (
					<CardAction>
						<button
							type="button"
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
			<CardFooter>
				<Badge variant="default" size="lg" className="ml-auto w-fit">
					{ctx.rating} <StarIcon className="fill-white text-white" />
					<span className="text-white/70 text-xs leading-px tracking-tighter">
						({numFmt.format(ctx.place.totalVotes)})
					</span>
				</Badge>
			</CardFooter>
		</Card>
	);
}
