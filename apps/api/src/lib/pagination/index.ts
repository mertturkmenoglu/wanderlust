import z from 'zod';

export namespace Pagination {
	export const queryParamsSchema = z.object({
		page: z
			.number()
			.int()
			.min(1)
			.optional()
			.default(1)
			.meta({
				description: 'Page number (starts from 1)',
				examples: [6],
			}),
		pageSize: z
			.number()
			.int()
			.min(0)
			.max(100)
			.multipleOf(10)
			.optional()
			.default(10)
			.meta({
				description: 'Number of items per page (must be a multiple of 10)',
				examples: [10, 20, 30],
			}),
	});

	export type QueryParams = z.infer<typeof queryParamsSchema>;

	export const schema = z
		.object({
			page: z
				.number()
				.int()
				.min(1)
				.meta({
					description: 'Current page number',
					examples: [1, 2, 3],
				}),
			pageSize: z
				.number()
				.int()
				.min(0)
				.max(100)
				.multipleOf(10)
				.meta({
					description: 'Number of items per page',
					examples: [10, 20, 30],
				}),
			totalRecords: z
				.number()
				.int()
				.min(0)
				.meta({
					description: 'Total number of records',
					examples: [0, 100, 250],
				}),
			totalPages: z
				.number()
				.int()
				.min(0)
				.meta({
					description: 'Total number of pages',
					examples: [0, 10, 25],
				}),
			hasPrevious: z.boolean().meta({
				description: 'Indicates if there is a previous page',
				examples: [true, false],
			}),
			hasNext: z.boolean().meta({
				description: 'Indicates if there is a next page',
				examples: [true, false],
			}),
		})
		.meta({
			description: 'Pagination information',
		});

	export type Info = z.infer<typeof schema>;

	export function getOffset(params: QueryParams): number {
		if (params.page <= 0 || params.pageSize <= 0) {
			return 0;
		}

		if (params.pageSize > 100 || params.page > 1000) {
			return 0;
		}

		return (params.page - 1) * params.pageSize;
	}

	export function compute(params: QueryParams, totalRecords: number): Info {
		const modulo = Math.floor(totalRecords % params.pageSize);
		let carry = 0;

		if (modulo > 0 && totalRecords > 0) {
			carry = 1;
		}

		const totalPages = Math.floor(totalRecords / params.pageSize) + carry;
		const hasPrevious = params.page > 1 && totalRecords > 0;
		const hasNext = params.page < totalPages && totalRecords > 0;

		return {
			page: params.page,
			pageSize: params.pageSize,
			totalRecords,
			totalPages,
			hasPrevious,
			hasNext,
		};
	}
}
