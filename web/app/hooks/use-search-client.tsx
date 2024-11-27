import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

export function useSearchClient() {
  const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
    server: {
      apiKey: "wanderlust",
      nodes: [
        {
          host: "localhost",
          port: 8108,
          protocol: "http",
        },
      ],
      numRetries: 8,
      useServerSideSearchCache: true,
    },
    additionalSearchParameters: {
      query_by: "name",
    },
  });
  const searchClient = typesenseInstantsearchAdapter.searchClient;

  return searchClient;
}
