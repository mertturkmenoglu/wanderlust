import { getRouteApi, Link } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import { PlaceCard } from '@/components/place-card';
import { useTopPlacesContext } from './context';

type Props = {
	className?: string;
};

export function Grid({ className }: Props) {
	const ctx = useTopPlacesContext();
	const route = getRouteApi('/u/$username');
	const { meta } = route.useLoaderData();
	const isThisUser = meta.isSelf;

	return (
		<div
			className={cn('grid w-full grid-cols-1 gap-4 xl:grid-cols-2', className)}
		>
			{ctx.items.length === 0 && (
				<div className="col-span-full mt-8 flex flex-col items-center justify-center gap-4">
					<span className="text-muted-foreground">
						{isThisUser ? "You haven't" : "This user hasn't"} added any favorite
						locations yet.
					</span>
				</div>
			)}

			{ctx.items.map((place) => (
				<Link
					to="/p/$id"
					key={place.id}
					params={{
						id: place.id,
					}}
				>
					<PlaceCard key={place.id} place={place} variant="item" />
				</Link>
			))}
		</div>
	);
}
