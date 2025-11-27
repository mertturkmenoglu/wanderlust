import { $ } from "@/db/schema";
import z from "zod";

export const listInput = z.object({});

export const listOutput = z.object({
  categories: $.category.array(),
});

export type ListOutput = z.infer<typeof listOutput>;

export const createInput = $.category.pick({
  id: true,
  name: true,
  image: true,
});

export type CreateInput = z.infer<typeof createInput>;

export const createOutput = z.object({
  category: $.category,
});

export type CreateOutput = z.infer<typeof createOutput>;

export const updateInput = createInput;

export type UpdateInput = z.infer<typeof updateInput>;

export const updateOutput = createOutput;

export type UpdateOutput = z.infer<typeof updateOutput>;

export const deleteInput = $.category.pick({
  id: true,
});

export type DeleteInput = z.infer<typeof deleteInput>;

export const deleteOutput = z.object({});
