import z from 'zod';

export namespace Sort {
	export function createSortSchema<const T extends readonly string[]>(allowedFields: T) {
		return z.object({
			field: z.enum(allowedFields).meta({
				description: 'Field to sort by',
				examples: allowedFields,
			}),
			order: z
				.enum(['asc', 'desc'])
				.optional()
				.default('asc')
				.meta({
					description: 'Sort order (ascending or descending)',
					examples: ['asc', 'desc'],
				}),
		});
	}

	export const queryParamsSchema = z.object({
		field: z.string().meta({
			description: 'Field to sort by',
			examples: ['name', 'createdAt'],
		}),
		order: z
			.enum(['asc', 'desc'])
			.optional()
			.default('asc')
			.meta({
				description: 'Sort order (ascending or descending)',
				examples: ['asc', 'desc'],
			}),
	});

	export type QueryParams = z.infer<typeof queryParamsSchema>;

	export const schema = z.object({
		field: z.string().meta({
			description: 'Field to sort by',
			examples: ['name', 'createdAt'],
		}),
		order: z.enum(['asc', 'desc']).meta({
			description: 'Sort order (ascending or descending)',
			examples: ['asc', 'desc'],
		}),
	});

	export type Info = z.infer<typeof schema>;
}
