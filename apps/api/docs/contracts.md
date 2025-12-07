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
- Inside `routes` directory, every subdirectory is a domain. Each of these modules include these files:
  - `contract.ts`: Defines the API contract.
  - `dto.ts`: Defines the DTO (Data Transfer Object) schemas
  - `index.ts`: Implements the API contract. You can think of this as the "controller" layer of the n-tier architecture.
  - `service.ts`: Implements the business logic. You can think of this as the "service" layer of the n-tier architecture.
  - `repository.ts`: Encapsulates Drizzle queries in functions. Same as the "repository" layer of the n-tier architecture.
