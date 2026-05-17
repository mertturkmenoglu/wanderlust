import { createWriteStream } from 'node:fs';
import { inspect } from 'node:util';
import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins';
import { onError } from '@orpc/server';
import { RPCHandler } from '@orpc/server/fetch';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';
import { getAppRouter } from '.';

const errorLog = createWriteStream('errors.log', { flags: 'a' });

export function getApiHandler() {
	const appRouter = getAppRouter();

	return new OpenAPIHandler(appRouter, {
		plugins: [
			new OpenAPIReferencePlugin({
				docsProvider: 'scalar',
				schemaConverters: [new ZodToJsonSchemaConverter()],
				docsTitle: 'Wanderlust API Documentation',
				docsHead: `<link rel="icon" href="https://raw.githubusercontent.com/mertturkmenoglu/wanderlust/refs/heads/main/web/public/favicon.ico" />`,
				specGenerateOptions: {
					info: {
						title: 'Wanderlust API',
						version: '3.0.0',
						description: 'API documentation for the Wanderlust application.',
						license: {
							name: 'MIT',
							url: 'https://opensource.org/license/mit/',
						},
						summary:
							'Wanderlust is a travel planning application that helps users organize and manage their trips effectively.',
					},
				},
			}),
		],
		interceptors: [
			onError((error) => {
				console.error(error);
			}),
		],
	});
}

export function getRpcHandler() {
	const appRouter = getAppRouter();

	return new RPCHandler(appRouter, {
		interceptors: [
			onError(async (error) => {
				if (process.env.NODE_ENV === 'development') {
					const entry = {
						timestamp: new Date().toISOString(),
						error,
					};

					const formatted = inspect(entry, {
						depth: Number.POSITIVE_INFINITY,
						breakLength: 120,
						compact: false,
					});

					errorLog.write(`${formatted}\n----\n`);
				}
			}),
		],
	});
}
