import { InstantSearch } from 'react-instantsearch';
import { toast } from 'sonner';
import { Autocomplete } from '@/components/autocomplete';
import { useSearchClient } from '@/hooks/use-search-client';
import { useTopPlacesContext } from './context';
import { useTopPlacesMutation } from './hooks';

export function Search() {
	const searchClient = useSearchClient();
	const ctx = useTopPlacesContext();
	const mutation = useTopPlacesMutation();
	const { items } = ctx;

	return (
		<div>
			<InstantSearch
				indexName="places"
				searchClient={searchClient}
				routing={false}
				future={{
					preserveSharedStateOnUnmount: true,
				}}
			>
				<Autocomplete
					showAdvancedSearch={false}
					showAllResultsButton={false}
					showRecentSearches={false}
					isCardClickable
					onCardClick={(v) => {
						const maxAllowedCount = 4;
						const alreadyInList = items.some((lo) => lo.id === v.id);

						if (alreadyInList) {
							toast.error('Place is already added.');
							return;
						}

						if (items.length >= maxAllowedCount) {
							toast.error(`Maximum ${maxAllowedCount} places can be added.`);
							return;
						}

						mutation.mutate({
							placesIds: [...items.map((place) => place.id), v.id],
						});

						ctx.setMode('items');
					}}
				/>
			</InstantSearch>
		</div>
	);
}
