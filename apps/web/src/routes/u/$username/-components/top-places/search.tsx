import { toast } from 'sonner';
import { Search as GlobalSearchComponent } from '@/components/search';
import type { TSearchHit } from '@/lib/search';
import { useTopPlacesContext } from './context';
import { useTopPlacesMutation } from './hooks';

export function Search() {
	const ctx = useTopPlacesContext();
	const mutation = useTopPlacesMutation();
	const { items } = ctx;

	return (
		<GlobalSearchComponent
			variant="local"
			onItemClick={(v) => {
				const item = v as TSearchHit;
				const maxAllowedCount = 4;
				const alreadyInList = items.some((lo) => lo.place.id === item.id);

				if (alreadyInList) {
					toast.error('Place is already added.');
					return;
				}

				if (items.length >= maxAllowedCount) {
					toast.error(`Maximum ${maxAllowedCount} places can be added.`);
					return;
				}

				mutation.mutate({
					placesIds: [...items.map((place) => place.place.id), item.place.id],
				});

				ctx.setMode('items');
			}}
		/>
	);
}
