import z from "zod";

export namespace Pagination {
  export const queryParamsSchema = z.object({
    page: z.number().int().min(1).optional().default(1),
    pageSize: z
      .number()
      .int()
      .min(0)
      .max(100)
      .multipleOf(10)
      .optional()
      .default(10),
  });

  export type QueryParams = z.infer<typeof queryParamsSchema>;

  export const schema = z.object({
    page: z.number().int().min(1),
    pageSize: z.number().int().min(0).max(100).multipleOf(10),
    totalRecords: z.number().int().min(0),
    totalPages: z.number().int().min(0),
    hasPrevious: z.boolean(),
    hasNext: z.boolean(),
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
