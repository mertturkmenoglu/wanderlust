import { useLoaderData } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import { PlaceCard } from '@/components/place-card';
import { ChangeView } from './-change-view';
import { useListContext } from './-context';

export function Items() {
	const { list } = useLoaderData({ from: '/lists/$id/' });
	const ctx = useListContext();

	return (
		<div>
			<ChangeView />
			<div
				className={cn('mt-2 grid grid-cols-1 gap-4', {
					'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4': ctx.view === 'grid',
				})}
			>
				{list.items.map((listItem) => (
					<PlaceCard
						key={listItem.placeId}
						place={listItem.place}
						as="link"
						variant={ctx.view === 'grid' ? 'default' : 'item'}
					/>
				))}
			</div>
		</div>
	);
}
