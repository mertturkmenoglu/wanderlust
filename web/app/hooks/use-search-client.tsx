import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

export function useSearchClient() {
  const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
    server: {
      apiKey: import.meta.env.VITE_SEARCH_CLIENT_API_KEY ?? "",
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

// export function useGeoSearchClient() {
//   const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
//     server: {
//       apiKey: process.env.NEXT_PUBLIC_SEARCH_CLIENT_API_KEY ?? '',
//       nodes: [
//         {
//           host: 'localhost',
//           port: 8108,
//           protocol: 'http',
//         },
//       ],
//       numRetries: 8,
//       useServerSideSearchCache: true,
//     },
//     additionalSearchParameters: {
//       query_by: 'address',
//     },
//     geoLocationField: 'coordinates',
//   });
//   const searchClient = typesenseInstantsearchAdapter.searchClient;

//   return searchClient;
// }
