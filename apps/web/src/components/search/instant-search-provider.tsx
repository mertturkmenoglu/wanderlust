import { type PropsWithChildren, useMemo } from 'react';
import { InstantSearch } from 'react-instantsearch';
import {
	useCitiesSearchClient,
	usePlacesSearchClient,
	useSearchClient,
	useUsersSearchClient,
} from '@/hooks/use-search-client';
import { useSearchType } from '@/hooks/use-search-type';

type Props = PropsWithChildren<{
	variant: 'global' | 'local';
}>;

export function InstantSearchProvider({ children, variant }: Props) {
	const searchClient = useSearchClient();
	const placesClient = usePlacesSearchClient();
	const usersClient = useUsersSearchClient();
	const citiesClient = useCitiesSearchClient();
	const [searchType] = useSearchType();

	const index = variant === 'global' ? searchType : 'places';

	const client = useMemo(() => {
		switch (index) {
			case 'places':
				return placesClient;
			case 'users':
				return usersClient;
			case 'cities':
				return citiesClient;
			default:
				return searchClient;
		}
	}, [index, searchClient, placesClient, usersClient, citiesClient]);

	return (
		<InstantSearch
			indexName={variant === 'global' ? searchType : 'places'}
			searchClient={client}
			routing={false}
			future={{
				preserveSharedStateOnUnmount: true,
			}}
		>
			{children}
		</InstantSearch>
	);
}
