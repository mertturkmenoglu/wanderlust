import z from 'zod';

export namespace Filter {
	export function createFilterSchema<
		const F extends readonly string[],
		const O extends readonly string[],
	>(allowedFields: F, allowedOperators: O) {
		return z.object({
			filters: z
				.object({
					field: z.enum(allowedFields),
					operator: z.enum(allowedOperators),
					value: z.any(),
				})
				.array(),
		});
	}

	export const queryParamsSchema = z.object({
		filters: z
			.object({
				field: z.string().meta({
					description: 'Field to filter by',
					examples: ['name', 'createdAt'],
				}),
				operator: z
					.enum([
						'eq',
						'ne',
						'gt',
						'lt',
						'gte',
						'lte',
						'in',
						'notIn',
						'like',
						'ilike',
					])
					.meta({
						description: 'Filter operator',
						examples: [
							'eq',
							'ne',
							'gt',
							'lt',
							'gte',
							'lte',
							'in',
							'notIn',
							'like',
							'ilike',
						],
					}),
				value: z.any().meta({
					description: 'Value to filter by',
					examples: ['exampleValue'],
				}),
			})
			.array()
			.meta({
				description: 'Array of filter conditions',
				examples: [
					[
						{ field: 'name', operator: 'eq', value: 'exampleName' },
						{ field: 'createdAt', operator: 'gt', value: '2023-01-01' },
					],
				],
			}),
	});

	export type QueryParams = z.infer<typeof queryParamsSchema>;

	export const schema = z.object({
		filters: z
			.object({
				field: z.string().meta({
					description: 'Field to filter by',
					examples: ['name', 'createdAt'],
				}),
				operator: z
					.enum([
						'eq',
						'ne',
						'gt',
						'lt',
						'gte',
						'lte',
						'in',
						'notIn',
						'like',
						'ilike',
					])
					.meta({
						description: 'Filter operator',
						examples: [
							'eq',
							'ne',
							'gt',
							'lt',
							'gte',
							'lte',
							'in',
							'notIn',
							'like',
							'ilike',
						],
					}),
				value: z.any().meta({
					description: 'Value to filter by',
					examples: ['exampleValue'],
				}),
			})
			.array()
			.meta({
				description: 'Array of filter conditions',
				examples: [
					[
						{ field: 'name', operator: 'eq', value: 'exampleName' },
						{ field: 'createdAt', operator: 'gt', value: '2023-01-01' },
					],
				],
			}),
	});

	export type Info = z.infer<typeof schema>;
}
