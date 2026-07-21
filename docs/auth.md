# Authentication

- We are using [Better Auth](https://www.better-auth.com/) for authentication.
- All apps and packages uses a common auth package located at `packages/auth`.
- You can see the auth OpenAPI endpoints at: `http://localhost:5000/api/auth/`

## Authentication Patterns

- Any router or RPC method that requires authentication should use the `requireAuth` middleware.
- You may directly access session information on the `context` object but it is recommended to use `getUserId` and `getUserIdOrThrow` functions to get the userId from the session.
- All methods of a service must take the `userId` as the first parameter.
- All methods of a repository must take the `userId` as the first parameter.
- `userId` parameter can be of type `string` or `string | null` depending on whether the method requires authentication or not. If the method requires authentication, it should use `string` type and if it doesn't require authentication, it should use `string | null` type.
- If a method doesn't use the `userId` parameter, you must prefix it with an underscore (i.e., `_userId`) to indicate that it is unused and it is intentional.

# Authorization

Although we have plans for using a dedicated authorization library, we are currently relying on custom authorization checks.

The convention we are following is creating an `authz.ts` file in the same directory as the `service.ts` that uses it and adding functions that check if the user has the required permissions to perform certain actions.

## Authorization Patterns

- Authz function naming conventions: 
	- `can<action><resource>`. For example, `canCreateUser`, `canDeletePost`, etc.
	- Or, `is<role>`. For example, `isAdmin`, `isParticipant`, etc.
- Authz functions should take a resource object as the first parameter and a userId as the second parameter. Example:

```typescript
export function canDeleteTrip(trip: Trip, userId: string): boolean {
	// Authorization logic here
}
```

- All authz functions must be synchronous. (Do not use `async`/`await` or return a `Promise`)
- All authz functions must return a `boolean` value indicating whether the user is authorized to perform the action on the resource.
- All authz functions must be *pure* functions. (Do not modify the resource object or any other external state)
- All authz functions should have accompanying unit tests that test the function with different user roles and permissions. Use *table driven tests* to cover possible scenarios as much as possible.
