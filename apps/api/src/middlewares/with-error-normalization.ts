import { ORPCError, os } from "@orpc/server";

export const withErrorNormalization = os.middleware(async ({ next }) => {
	try {
		return await next();
	} catch (err) {
		if (err instanceof ORPCError) throw err;
		throw new ORPCError('INTERNAL_SERVER_ERROR', {
			message: 'An unexpected error occurred',
			cause: err,
		});
	}
})
