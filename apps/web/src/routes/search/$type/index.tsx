import { createFileRoute } from '@tanstack/react-router';
import { history } from 'instantsearch.js/es/lib/routers';
import type { RouterProps } from 'instantsearch.js/es/middlewares';
import { InstantSearch } from 'react-instantsearch';
import z from 'zod';
import {
	useCitiesSearchClient,
	usePlacesSearchClient,
	useUsersSearchClient,
} from '@/hooks/use-search-client';
import { deserializeParams, serializeParams } from '@/lib/search';
import { seo } from '@/lib/seo';
import { CitiesContainer } from './-cities';
import { PlacesContainer } from './-places';
import { UsersContainer } from './-users';

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

export const Route = createFileRoute('/search/$type/')({
	component: RouteComponent,
	validateSearch: schema,
	ssr: false,
	beforeLoad: ({ params }) => {
		const type = params.type;

		if (type !== 'places' && type !== 'cities' && type !== 'users') {
			throw new Error(`Invalid search type: ${type}`);
		}
	},
	head: () => {
		const { meta, links } = seo({
			title: 'Search',
			description: 'Search for places, cities, and users on Wanderlust',
			applicationName: 'Wanderlust',
			openGraph: {
				title: 'Search',
				type: 'website',
				url: '/search/',
				locale: 'en_US',
				description: 'Search for places, cities, and users on Wanderlust',
				siteName: 'Wanderlust',
			},
			twitter: {
				card: 'summary_large_image',
				title: 'Search',
				description: 'Search for places, cities, and users on Wanderlust',
			},
		});

		return {
			meta,
			links,
		};
	},
});

function RouteComponent() {
	const placesClient = usePlacesSearchClient();
	const citiesClient = useCitiesSearchClient();
	const usersClient = useUsersSearchClient();

	const { type } = Route.useParams();
	const indexName = type;

	return (
		<div className="mx-auto my-8 w-full max-w-7xl">
			{type === 'places' && (
				<InstantSearch
					indexName={indexName}
					searchClient={placesClient}
					routing={routing}
					future={{
						preserveSharedStateOnUnmount: true,
					}}
				>
					<PlacesContainer />
				</InstantSearch>
			)}
			{type === 'cities' && (
				<InstantSearch
					indexName={indexName}
					searchClient={citiesClient}
					routing={routing}
					future={{
						preserveSharedStateOnUnmount: true,
					}}
				>
					<CitiesContainer />
				</InstantSearch>
			)}
			{type === 'users' && (
				<InstantSearch
					indexName={indexName}
					searchClient={usersClient}
					routing={routing}
					future={{
						preserveSharedStateOnUnmount: true,
					}}
				>
					<UsersContainer />
				</InstantSearch>
			)}
		</div>
	);
}
