import { createWriteStream } from 'node:fs';
import { inspect } from 'node:util';
import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins';
import { onError } from '@orpc/server';
import { RPCHandler } from '@orpc/server/fetch';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';
import { getAppRouter } from '.';

const errorLog = createWriteStream('errors.log', { flags: 'a' });

const favicon =
	'https://raw.githubusercontent.com/mertturkmenoglu/wanderlust/refs/heads/main/web/public/favicon.ico';

export function getApiHandler() {
	const appRouter = getAppRouter();

	return new OpenAPIHandler(appRouter, {
		plugins: [
			new OpenAPIReferencePlugin({
				docsProvider: 'scalar',
				schemaConverters: [new ZodToJsonSchemaConverter()],
				docsTitle: 'Wanderlust API Documentation',
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
				renderDocsHtml: (specUrl, title, _head, scriptUrl) => {
					const config = [
						{ url: specUrl, title: 'Wanderlust API' },
						{ url: '/api/auth/open-api/generate-schema', title: 'Auth API' },
					];

					return `
					<html>
					<head>
						<meta charset="utf-8" />
						<meta name="viewport" content="width=device-width, initial-scale=1" />
						<title>${title}</title>
						<link rel="icon" href="${favicon}" />
					</head>
					<body>
						<div id="app"></div>
						<script src="${scriptUrl}"></script>
						<script>
							const cfg = ${JSON.stringify(config)};
							Scalar.createApiReference('#app', cfg);
						</script>
					</body>
					</html>
					`;
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
