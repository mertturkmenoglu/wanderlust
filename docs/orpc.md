# oRPC

oRPC is a backend framework for building type-safe, OpenAPI-compliant APIs.

We highly recommend reading the [oRPC documentation](https://orpc.dev/docs/getting-started) to understand how it works and how to use it effectively.

# OpenAPI 

- oRPC with the `OpenAPIHandler` is used for generating OpenAPI docs.
- Default spec viewer is `Scalar`. To open it, go to `http://localhost:5000/api`.
- To get the spec, go to `http://localhost:5000/api/spec.json`

# Contracts

- According to oRPC docs:

> Contract-first development is a design pattern where you define the API contract before writing any implementation code. This methodology promotes a well-structured codebase that adheres to best practices and facilitates easier maintenance and evolution over time.
>
> In oRPC, a contract specifies the rules and expectations for a procedure. It details the input, output, errors,... types and can include constraints or validations to ensure that both client and server share a clear, consistent interface.

- In other words, we define the procedure prototype, input, output, errors, and route information before we implement the procedure.

- In classical MVC terms:

  - Input and output corresponds to DTOs.
  - Errors and route information are used in OpenAPI schema definition.

- You can think of this "layer" as the "controller" of the MVC model. (Similar but not quite equivalent)
- You can find the contracts in `packages/contract` package.
  - `contract.ts`: Defines the API contract.
  - `dto.ts`: Defines the DTO (Data Transfer Object) schemas
- In core API, inside `src/routes` directory, every subdirectory is a domain (or at least roughly equivalent). Each of these modules include these files:
  - `index.ts`: Implements the API contract. You can think of this as the "controller" layer of the n-tier architecture.
  - `service.ts`: Implements the business logic. Same as the "service" layer of the n-tier architecture.
  - `repository.ts`: Encapsulates Drizzle queries in functions. Same as the "repository" layer of the n-tier architecture.
