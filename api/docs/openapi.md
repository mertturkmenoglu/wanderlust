# OpenAPI

- Huma autogenerates OpenAPI spec for the API.
- Visit `http://localhost:5000/docs` to view the OpenAPI explorer.
- You can also view the OpenAPI spec at `http://localhost:5000/openapi.yaml`.
- To switch between explorers, change `API_DOCS_TYPE` environment variable. Possible values are:
  - `scalar`: Scalar OpenAPI explorer. (Preferred)
  - `stoplight`: Stoplight OpenAPI explorer. (Huma default, fallback option)
- Read `scalar.md` for more information on using Scalar.
