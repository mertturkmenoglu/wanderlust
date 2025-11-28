import { $ } from "@/db/schema";
import { Pagination } from "@/lib/pagination";
import z from "zod";

export const getInput = $.report.pick({
  id: true,
});

export type GetInput = z.infer<typeof getInput>;

export const getOutput = z.object({
  report: $.report,
});

export type GetOutput = z.infer<typeof getOutput>;

export const listInput = Pagination.queryParamsSchema.extend({});

export type ListInput = z.infer<typeof listInput>;

export const listOutput = z.object({
  reports: z.array($.report),
  pagination: Pagination.schema,
});

export type ListOutput = z.infer<typeof listOutput>;

export const searchInput = Pagination.queryParamsSchema.extend(
  $.report
    .pick({
      reporterId: true,
      resourceType: true,
      reason: true,
      resolved: true,
    })
    .partial().shape
);

export type SearchInput = z.infer<typeof searchInput>;

export const searchOutput = z.object({
  reports: z.array($.report),
  pagination: Pagination.schema,
});

export type SearchOutput = z.infer<typeof searchOutput>;

export const createInput = $.report.pick({
  resourceId: true,
  resourceType: true,
  reason: true,
  description: true,
});

export type CreateInput = z.infer<typeof createInput>;

export const createOutput = z.object({
  report: $.report,
});

export type CreateOutput = z.infer<typeof createOutput>;

export const deleteInput = $.report.pick({
  id: true,
});

export type DeleteInput = z.infer<typeof deleteInput>;

export const deleteOutput = z.object({});

export type DeleteOutput = z.infer<typeof deleteOutput>;

export const updateInput = $.report.pick({
  id: true,
  description: true,
  reason: true,
  resolved: true,
});

export type UpdateInput = z.infer<typeof updateInput>;

export const updateOutput = z.object({
  report: $.report,
});

export type UpdateOutput = z.infer<typeof updateOutput>;
