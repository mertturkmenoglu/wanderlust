import { $ } from "@/db/schema";
import { Pagination } from "@/lib/pagination";
import z from "zod";

export const createInput = z.object({
  placeId: z.string().min(1),
});

export type CreateInput = z.infer<typeof createInput>;

export const createOutput = z.object({
  bookmark: $.bookmark,
});

export type CreateOutput = z.infer<typeof createOutput>;

export const deleteInput = z.object({
  placeId: z.string().min(1),
});

export type DeleteInput = z.infer<typeof deleteInput>;

export const deleteOutput = z.object({});

export type DeleteOutput = z.infer<typeof deleteOutput>;

export const listInput = Pagination.queryParamsSchema.extend({});

export type ListInput = z.infer<typeof listInput>;

const place = $.place.extend({
  assets: $.asset.array(),
  category: $.category,
  address: $.address,
});

export const listOutput = z.object({
  bookmarks: $.bookmark
    .extend({
      place: place,
    })
    .array(),
  pagination: Pagination.schema,
});

export type ListOutput = z.infer<typeof listOutput>;
