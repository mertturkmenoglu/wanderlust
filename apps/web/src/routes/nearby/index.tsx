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
		<div className="mx-auto my-16 max-w-7xl">
			<h2 className="font-bold text-2xl">Nearby Locations</h2>
			<InstantSearch indexName="pois" searchClient={searchClient} routing>
				<Container />
			</InstantSearch>
		</div>
	);
}
