import { useSearchClient } from '@/hooks/use-search-client';
import { deserializeParams, serializeParams } from '@/lib/search';
import { createFileRoute } from '@tanstack/react-router';
import { history } from 'instantsearch.js/es/lib/routers';
import type { RouterProps } from 'instantsearch.js/es/middlewares';
import { InstantSearch } from 'react-instantsearch';
import { z } from 'zod';
import Container from './-components/container';

const schema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  category: z.string().optional(),
  amenity: z.string().optional(),
  price: z.string().or(z.number()).optional(),
  a11y: z.string().or(z.number()).optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

export const Route = createFileRoute('/search/')({
  component: RouteComponent,
  validateSearch: schema,
});

const routing: RouterProps = {
  router: history(),
  stateMapping: {
    // TODO: I don't know why this is not working
    // @ts-expect-error
    stateToRoute(uiState) {
      const s = uiState['pois'];
      return {
        q: s?.query,
        page: s?.page,
        pageSize: s?.hitsPerPage,
        category: serializeParams(s?.refinementList?.['poi.category.name']),
        amenity: serializeParams(s?.refinementList?.['poi.amenities.name']),
        price: serializeParams(s?.refinementList?.['poi.priceLevel']),
        a11y: serializeParams(s?.refinementList?.['poi.accessibilityLevel']),
        state: serializeParams(
          s?.refinementList?.['poi.address.city.state.name'],
        ),
        city: serializeParams(s?.refinementList?.['poi.address.city.name']),
        country: serializeParams(
          s?.refinementList?.['poi.address.city.country.name'],
        ),
      };
    },
    // TODO: I don't know why this is not working
    // @ts-expect-error
    routeToState(routeState) {
      console.log(typeof routeState.category);
      return {
        pois: {
          query: routeState.q,
          page: routeState.page,
          hitsPerPage: routeState.pageSize,
          refinementList: {
            'poi.category.name': deserializeParams(routeState.category),
            'poi.amenities.name': deserializeParams(routeState.amenity),
            'poi.priceLevel': deserializeParams(routeState.price),
            'poi.accessibilityLevel': deserializeParams(routeState.a11y),
            'poi.address.city.state.name': deserializeParams(routeState.state),
            'poi.address.city.name': deserializeParams(routeState.city),
            'poi.address.city.country.name': deserializeParams(
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
    <div className="mx-auto max-w-7xl my-16">
      <InstantSearch
        indexName="pois"
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
