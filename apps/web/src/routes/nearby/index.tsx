import { createFileRoute } from '@tanstack/react-router';
import { lazy } from 'react';
import { InstantSearch } from 'react-instantsearch';
import { useGeoSearchClient } from '@/hooks/use-search-client';
import { seo } from '@/lib/seo';

const Container = lazy(() =>
	import('./-components/container').then((mod) => ({ default: mod.Container })),
);

export const Route = createFileRoute('/nearby/')({
	component: RouteComponent,
	ssr: false,
	head: () =>
		seo({
			title: 'Nearby Places',
		}),
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
