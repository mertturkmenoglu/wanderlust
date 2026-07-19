# Architecture

- We are using a monorepo structure to manage multiple applications and shared packages in a single repository.
- We don't particularly follow any specific software architecture style/pattern/principle, but we do apply some concepts from ROD, DDD, vertical slice, tiered (n-layer) architecture:
	- ROD (Resource-oriented Design) (See [ADR-0010](adr/0010.md))
	- You may think of every folder in the `api/src/routes` as a `domain` in DDD.
	- Every route folder follows the VSA pattern, where the folder contains all the files related to a specific feature:
		- `index.ts`: Defines the module (what is exposed to the IoC container) and the router (RPC methods/HTTP handlers).
			- Each RPC method/HTTP handler is a thin layer that performs validation, middleware application, and data extraction and then delegates the request to the service layer.
			- Every RPC method has a corresponding `Input` and `Output` DTO defined in the `contract` package.
			- RPC methods follow the REPR (Request - Endpoint - Response) pattern.
		- `service.ts`: Intermediary layer that is responsible for calling appropriate repository methods and performing additional business logic as needed.
			- Caching
			- Authorization/Permission checks
			- Enqueuing background jobs
			- Content enrichment
		- `authz.ts`: Authorization/Permission checkers
		- `repository.ts`: Repository layer is responsible for interacting with the database and performing CRUD operations.
		- `statements.ts`: Prepared statements for database queries, which are used by the repository layer.
		- `enricher.ts`: Content enrichment layer is responsible for enriching the content with additional data from other sources.
- One of the important rules we follow is the **low coupling, high cohesion** principle.

## Request Flow

```mermaid
architecture-beta
	group all(cloud)[Request Flow]

	service client(internet)[Client] in all

	group api(cloud)[API] in all

	service gateway(server)[API Gateway] in api
	junction split in handlers

	group handlers(cloud)[Handlers] in api

	group reqres(cloud)[Request Response Layer] in api

	service rpc(server)[RPC Handler] in handlers
	service openapi(server)[OpenAPI Handler] in handlers

	junction join in api
	service router(server)[Resource Router] in reqres
	service validation(server)[Input Output Validation] in reqres
	service svc(server)[Service Layer] in api

	group svcaux(cloud)[Auxiliary Services] in api

	service authz(server)[Authorization Controls] in svcaux
	service cache(database)[Redis Cache] in svcaux
	service search(database)[Typesense Search] in svcaux
	service storage(disk)[S3 Storage] in svcaux
	service jobs(server)[Background Jobs] in svcaux
	service enricher(server)[Content Enrichment Layer] in svcaux
	junction svcjoin1 in svcaux
	junction svcjoin2 in svcaux
	junction svcjoin3 in svcaux

	group datalayer(database)[Data Layer] in api

	service repo(server)[Repository Layer] in datalayer
	service statements(server)[Prepared Statements] in datalayer
	service pg(database)[PostgreSQL Database] in datalayer

	client:R -- L:gateway
	gateway:R -- L:split

	split:T -- B:rpc
	split:B -- T:openapi

	rpc:R -- L:join

	join:R -- L:router
	validation:T -- B:router
	router:R -- L:svc
	svc:R -- L:repo
	repo:R -- L:pg
	statements:T -- B:repo

	authz:R -- L:svcjoin1
	search:L -- R:svcjoin1

	cache:R -- L:svcjoin2
	storage:L -- R:svcjoin2

	jobs:R -- L:svcjoin3
	enricher:L -- R:svcjoin3

	svcjoin1:B -- T:svc
	svcjoin2:B -- T:svcjoin1
	svcjoin3:B -- T:svcjoin2

```

## Structure

```mermaid
treeView-beta
apps/ ## runnable applications
	abs/ ## Agent Based Simulation application
	admin/ ## Admin panel for managing users, content, and other administrative tasks
	api/ ## Core backend API
	cli/ ## Command-line interface for various tasks and utilities
	fake/ ## Fake data generation CLI tool
	web/ ## Frontend web application
	wiop/ ## IPX image optimization service
packages/ ## shared packages
	auth/ ## Shared authentication package
	cache/ ## Shared cache and Redis package
	common/ ## Shared common utilities, types, and DTOs package
	config/ ## Shared configuration package
	contract/ ## Shared oRPC contract package for API and frontend communication
	db/ ## Shared database package for Drizzle ORM tables, relations, and partial queries
	email/ ## Shared email package for sending emails
	jobs/ ## Shared jobs package for background jobs and task scheduling
	richtext/ ## Shared rich text package for manipulating rich text content
	search/ ## Shared Typesense search service
	storage/ ## Shared storage package for file uploads and management
	ui/ ## Shared UI components package (ShadCN UI)
	uid/ ## Shared unique ID generation package
```

Related ADRs:
- [ADR-0004](adr/0004.md)
- [ADR-0007](adr/0007.md)

## Code Flow

- You should start reviewing the project by first inspecting the `api` and `web` applications, as they are the main entry points of the project.
- To delve deeper into the backend, you can start inspecting the `db`, `contract`, and `common` packages.
