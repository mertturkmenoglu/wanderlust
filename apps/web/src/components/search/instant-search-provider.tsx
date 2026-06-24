import type { PropsWithChildren } from 'react';
import { InstantSearch } from 'react-instantsearch';
import { useSearchClient } from '@/hooks/use-search-client';
import { useSearchType } from '@/hooks/use-search-type';

type Props = PropsWithChildren<{
	variant: 'global' | 'local';
}>;

export function InstantSearchProvider({ children, variant }: Props) {
	const searchClient = useSearchClient();
	const [searchType] = useSearchType();

	return (
		<InstantSearch
			indexName={variant === 'global' ? searchType : 'places'}
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
