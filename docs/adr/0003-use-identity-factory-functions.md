# ADR-0003: Use Identity Factory Functions

## Status
Accepted

## Context
An identity factory function (IFF) takes an object and returns the same object. This is useful when you want to ensure that object has the correct type without having to explicitly type all the generic parameters.

It is popularized by the Vite and Vue ecosystem. In Vite, you can use the `defineConfig` function to define your configuration object. In Vue, you can use the `defineProps` and `defineEmits` functions to define your component's props and emits.

## Decision
We started to use IFFs in our codebase to improve type inference and reduce the amount of boilerplate code.

As of now, we have the following IFFs in our codebase:
- (Admin) defineResource: Data resource definition for admin panel
- (Admin) defineRows: Data rows definition for admin panel
- (Admin) defineStaticData: Static data (breadcrumbs) definition for admin panel
- (API) defineModule: Router and submodules (exports) definition for API
- (API) definePreparedStatement: PostgreSQL and Drizzle ORM prepared statement definition for API

## Consequences
- Positive: 
	- Better type inference and reduced boilerplate code.
	- Better developer experience.
- Negative:
	- None at the moment.
- Neutral / follow-ups:

