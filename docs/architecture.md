# Architecture

- We are not following any particular software architecture style like DDD, clean, vertical slice, tiered, hexagonal, etc.
- You can see the concepts of DDD, vertical slice, and tiered (n-layer) architectures applied to this project.
- The whole repository is a monorepo.

## Structure

- `apps`:
	- `admin`: Admin panel for managing users, content, and other administrative tasks.
	- `api`: Core backend API.
	- `chat`: Chat API.
	- `fake`: Fake data generation CLI tool.
	- `notifications`: Notifications API.
	- `web`: Frontend web application.
	- `wiop`: IPX image optimization service.
- `packages`:
	- `auth`: Shared authentication package.
	- `cache`: Shared cache and Redis package.
	- `common`: Shared common utilities and DTOs package.
	- `config`: Shared configuration package.
	- `contract`: Shared oRPC contract package for API and frontend communication.
	- `db`: Shared database package for Drizzle ORM tables, relations, and partial queries.
	- `email`: Shared email package for sending emails.
	- `jobs`: Shared jobs package for background jobs and task scheduling.
	- `storage`: Shared storage package for file uploads and management.
	- `ui`: Shared UI components package. (ShadCN UI)
	- `uid`: Shared unique ID generation package.

## Code Flow

- You should start reviewing the project by first inspecting the `api` and `web` applications, as they are the main entry points of the project.
- To delve deeper into the backend, you can start inspecting the `db` and `contact` packages.
