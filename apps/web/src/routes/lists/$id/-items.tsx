import { cn } from '@wanderlust/ui/lib/utils';
import { PlaceCard } from '@/components/place-card';
import { ChangeView } from './-change-view';
import { useListContext } from './-context';
import { useListQuery } from './-hooks';

export function Items() {
	const query = useListQuery();
	const { list } = query.data;
	const ctx = useListContext();

	return (
		<div>
			<ChangeView />
			<div
				className={cn('mt-2 grid grid-cols-1 gap-4', {
					'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4': ctx.view === 'grid',
				})}
			>
				{list.items.map((item) => (
					<PlaceCard
						key={item.placeId}
						place={item.place}
						as="link"
						variant={ctx.view === 'grid' ? 'default' : 'item'}
					/>
				))}
			</div>
		</div>
	);
}
