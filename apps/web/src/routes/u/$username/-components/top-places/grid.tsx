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
		<div className={cn('grid grid-cols-2 gap-4', className)}>
			{ctx.items.length === 0 && (
				<div className="col-span-full flex flex-col items-center justify-center gap-4">
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
					className={cn('flex flex-row items-center justify-between gap-4')}
					params={{
						id: place.id,
					}}
				>
					<PlaceCard key={place.id} place={place} />
				</Link>
			))}
		</div>
	);
}
