import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";

export const openApiReference = new OpenAPIReferencePlugin({
	docsProvider: 'scalar',
	schemaConverters: [new ZodToJsonSchemaConverter()],
	docsTitle: 'Wanderlust Chat API Documentation',
	specGenerateOptions: {
		info: {
			title: 'Wanderlust Chat API',
			version: '1.0.0',
			description:
				'API documentation for the Wanderlust Chat application.',
			license: {
				name: 'MIT',
				url: 'https://opensource.org/license/mit/',
			},
			summary:
				'Wanderlust is a travel planning application that helps users organize and manage their trips effectively.',
		},
	},
})
