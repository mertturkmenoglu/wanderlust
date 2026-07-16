# ADR-0002: Merge Chat and Notifications Apps to Core

## Status
Accepted

## Context
We initially thought about separating core backend api from chat and notifications apps. One of the reasons was to have a clear separation of core domain models from auxiliary features. Second reason was to speed up the compilation and type inference process.

We solved the second problem by introduction Drizzle V2 (better type inference of DTOs) and by using appropriate Turborepo setup. Now, every package under `packages` directory is compiled in parallel during development when you run `turbo dev` and every dependent package/app uses the compiled version of the package. This speeds up the development process significantly.

After some initial development, we realized that the chat & notifications apps separation from the core api is not beneficial at this moment. We had to introduce Hono client dependency on the frontend and had to write both common backend structures and frontend structures for both apps. This is not a good developer experience and we want to avoid it.

## Decision
For these reasons, we decided to merge chat and notifications apps into the core backend api.

## Consequences
- Positive: 
	- Better developer experience, as we don't have to write both common backend structures and frontend structures for both apps.
	- Simplified architecture and development workflow.
- Negative: 
	- If we want to separate chat and notifications apps from the core api in the future, it will require some effort to refactor the codebase.
- Neutral / follow-ups:

