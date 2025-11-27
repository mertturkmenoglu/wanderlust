import { $ } from "@/db/schema";
import z from "zod";

export const listInput = z.object({});

export const listOutput = z.object({
  cities: $.city.array(),
});

export type ListOutput = z.infer<typeof listOutput>;

export const listFeaturedInput = z.object({});

export const listFeaturedOutput = z.object({
  cities: $.city.array(),
});

export type ListFeaturedOutput = z.infer<typeof listFeaturedOutput>;

export const getInput = $.city.pick({
  id: true,
});

export type GetInput = z.infer<typeof getInput>;

export const getOutput = z.object({
  city: $.city,
});

export type GetOutput = z.infer<typeof getOutput>;

export const createInput = $.city;

export type CreateInput = z.infer<typeof createInput>;

export const createOutput = z.object({
  city: $.city,
});

export type CreateOutput = z.infer<typeof createOutput>;

export const updateInput = createInput;

export type UpdateInput = z.infer<typeof updateInput>;

export const updateOutput = createOutput;

export type UpdateOutput = z.infer<typeof updateOutput>;

export const deleteInput = $.city.pick({
  id: true,
});

export type DeleteInput = z.infer<typeof deleteInput>;

export const deleteOutput = z.object({});
