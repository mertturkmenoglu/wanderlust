# Architecture

- We are not following any particular software architecture style like DDD, clean, vertical slice, tiered, hexagonal, etc.
- You can see the concepts of DDD, vertical slice, and tiered (n-layer) architectures applied to this project.
- The whole repository is a monorepo.

  - `apps`:
    - `api`: Backend API.
    - `web`: Frontend web application.
    - `wiop`: IPX image optimization service.
  - `packages`:
    - `config`: Shared configuration package.
    - `ui`: Shared UI components package.

- Each subfolder in the `apps/api/src/routes` folder (module) losely represents a domain object.
- Each module contains its own request and response DTOs (data transfer objects) but they all use shared validation schema defined in the `src/db/schema`.
- Project is mainly divided into three groups:
  - `db`: Contains the database schema and automatically generated Zod validation schemas (select and insert schemas).
  - `lib`: Contains the libraries.
  - `routes`: Contains the modules (features).

## Code Flow

- You should start reviewing the project by first inspecting the `src/index.ts` and `src/ioc.ts` files.
- These two files are the entry points of the application.
- Each feature/module is located in the `src/routes` folder.
- If something is meant to be used by other modules/features, it should be located in the `src/lib` folder.
