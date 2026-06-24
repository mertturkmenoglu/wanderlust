import type { PropsWithChildren } from 'react';
import { InstantSearch } from 'react-instantsearch';
import { useSearchClient } from '@/hooks/use-search-client';
import { useSearchType } from './hooks';

type Props = PropsWithChildren;

export function InstantSearchProvider({ children }: Props) {
	const searchClient = useSearchClient();
	const [searchType] = useSearchType();

	return (
		<InstantSearch
			indexName={searchType}
			searchClient={searchClient}
			routing={false}
			future={{
				preserveSharedStateOnUnmount: true,
			}}
		>
			{children}
		</InstantSearch>
	);
}
