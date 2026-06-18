import { createFileRoute } from '@tanstack/react-router';
import { history } from 'instantsearch.js/es/lib/routers';
import type { RouterProps } from 'instantsearch.js/es/middlewares';
import { InstantSearch } from 'react-instantsearch';
import { z } from 'zod';
import { useSearchClient } from '@/hooks/use-search-client';
import { deserializeParams, serializeParams } from '@/lib/search';
import { Container } from './-components/container';

const schema = z.object({
	q: z.string().optional(),
	page: z.transform(Number).pipe(z.number()).optional(),
	pageSize: z.transform(Number).pipe(z.number()).optional(),
	category: z.string().optional(),
	amenity: z.string().optional(),
	price: z.string().or(z.number()).optional(),
	a11y: z.string().or(z.number()).optional(),
	state: z.string().optional(),
	city: z.string().optional(),
	country: z.string().optional(),
	accolade: z.string().optional(),
});

export const Route = createFileRoute('/search/')({
	component: RouteComponent,
	validateSearch: schema,
});

// TODO: I don't know why this is not working, we shouldn't be using expect error.
// But I couldn't figure out a way to fix this issue.
const routing: RouterProps = {
	router: history(),
	stateMapping: {
		// @ts-expect-error TODO: fix it
		stateToRoute(uiState) {
			const s = uiState.places;
			return {
				q: s?.query,
				page: s?.page,
				pageSize: s?.hitsPerPage,
				category: serializeParams(s?.refinementList?.['place.category.name']),
				amenity: serializeParams(s?.refinementList?.['place.amenities']),
				price: serializeParams(s?.refinementList?.['place.priceLevel']),
				a11y: serializeParams(s?.refinementList?.['place.accessibilityLevel']),
				state: serializeParams(
					s?.refinementList?.['place.address.city.stateName'],
				),
				city: serializeParams(s?.refinementList?.['place.address.city.name']),
				country: serializeParams(
					s?.refinementList?.['place.address.city.countryName'],
				),
				accolade: serializeParams(
					s?.refinementList?.['place.accolades.accolade.title'],
				),
			};
		},
		// @ts-expect-error TODO: fix it
		routeToState(routeState) {
			return {
				places: {
					query: routeState.q,
					page: routeState.page,
					hitsPerPage: routeState.pageSize,
					refinementList: {
						'place.accolades.accolade.title': deserializeParams(
							routeState.accolade,
						),
						'place.category.name': deserializeParams(routeState.category),
						'place.amenities': deserializeParams(routeState.amenity),
						'place.priceLevel': deserializeParams(routeState.price),
						'place.accessibilityLevel': deserializeParams(routeState.a11y),
						'place.address.city.stateName': deserializeParams(routeState.state),
						'place.address.city.name': deserializeParams(routeState.city),
						'place.address.city.countryName': deserializeParams(
							routeState.country,
						),
					},
				},
			};
		},
	},
};

function RouteComponent() {
	const searchClient = useSearchClient();

	return (
		<div className="mx-auto my-8 max-w-7xl">
			<InstantSearch
				indexName="places"
				searchClient={searchClient}
				routing={routing}
				future={{
					preserveSharedStateOnUnmount: true,
				}}
			>
				<Container />
			</InstantSearch>
		</div>
	);
}
