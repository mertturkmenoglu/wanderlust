import { createFileRoute } from '@tanstack/react-router';
import { InstantSearch } from 'react-instantsearch';
import { useGeoSearchClient } from '@/hooks/use-search-client';
import { Container } from './-components/container';

export const Route = createFileRoute('/nearby/')({
	component: RouteComponent,
});

function RouteComponent() {
	const searchClient = useGeoSearchClient({
		additionalSearchParameters: {
			per_page: 50,
		},
	});

	return (
		<div>
			<InstantSearch indexName="places" searchClient={searchClient} routing>
				<Container />
			</InstantSearch>
		</div>
	);
}
