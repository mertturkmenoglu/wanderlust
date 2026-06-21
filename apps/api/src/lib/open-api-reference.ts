import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";

const favicon =
	'https://raw.githubusercontent.com/mertturkmenoglu/wanderlust/refs/heads/main/web/public/favicon.ico';

export const openApiReference = new OpenAPIReferencePlugin({
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
});
