# Type Generation

- Web project uses [openapi-typescript](https://github.com/openapi-ts/openapi-typescript) to generate types from OpenAPI spec.
- The generator script expects the OpenAPI spect to be located at the URL: `http://localhost:5000/openapi.yaml`.
- To generate types, run the following command:

```bash
pnpm openapi
```

- The generated types will be located at `src/lib/api-types.ts`.

## Using API Client

- You can use the API client to make requests to the API.
- Client is located at `src/lib/api.ts`.
- You can use the client like this:

```ts
import { fetchClient } from '@/lib/api';

const res = await api.GET('/api/v2/health/');
```

## Using API Client with React Query

- You can use the API client with React Query to make requests to the API.
- Client is located at `src/lib/api.ts`.
- You can use the client like this:

```ts
import { api } from '@/lib/api';

const res = await api.useQuery('get', '/api/v2/health/');
```

- Or you can get the query options, and use it with your query client:

```ts
import { api } from '@/lib/api';

const options = api.queryOptions('get', '/api/v2/health/');

// Get query client from somewhere
const res = await queryClient.fetchQuery(options);
```
