import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

export function useSearchClient() {
  const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
    server: {
      apiKey: 'wanderlust',
      nodes: [
        {
          host: 'localhost',
          port: 8108,
          protocol: 'http',
        },
      ],
      numRetries: 8,
      useServerSideSearchCache: true,
    },
    additionalSearchParameters: {
      query_by: 'name',
    },
  });
  const searchClient = typesenseInstantsearchAdapter.searchClient;

  return searchClient;
}

type GeoSearchClientProps = {
  additionalSearchParameters?: Record<string, any>;
};

export function useGeoSearchClient(props?: GeoSearchClientProps) {
  const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
    server: {
      apiKey: 'wanderlust',
      nodes: [
        {
          host: 'localhost',
          port: 8108,
          protocol: 'http',
        },
      ],
      numRetries: 8,
      useServerSideSearchCache: true,
    },
    additionalSearchParameters: {
      query_by: 'name',
      per_page: 10,
      ...(props?.additionalSearchParameters ?? {}),
    },
    geoLocationField: 'location',
  });

  const searchClient = typesenseInstantsearchAdapter.searchClient;

  return searchClient;
}
