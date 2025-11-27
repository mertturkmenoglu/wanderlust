import { $ } from "@/db/schema";
import z from "zod";

const place = $.place.extend({
  assets: $.asset.array(),
  category: $.category,
  address: $.address,
});

export const getInput = z.object({
  id: z.string(),
});

export type GetInput = z.infer<typeof getInput>;

export const getOutput = z.object({
  place: place,
  meta: z.object({
    isFavorite: z.boolean(),
    isBookmarked: z.boolean(),
  }),
});

export type GetOutput = z.infer<typeof getOutput>;

export const peekInput = z.object({});

export const peekOutput = z.object({
  places: place.array(),
});

export type PeekOutput = z.infer<typeof peekOutput>;

export const updateInput = z.object({
  id: z.string(),
  name: z.string().min(1).max(128),
  categoryId: z.number().int().min(1).max(32767),
  description: z.string().min(1),
  phone: z.string().min(1).max(32).optional(),
  email: z.email().optional(),
  website: z.url().optional(),
  accessibilityLevel: z.number().int().min(1).max(5),
  priceLevel: z.number().int().min(1).max(5),
});

export type UpdateInput = z.infer<typeof updateInput>;

export const updateOutput = z.object({
  place: place,
});

export type UpdateOutput = z.infer<typeof updateOutput>;

export const updateAddressInput = z.object({
  id: z.string(),
  cityId: z.number().int().min(1),
  line1: z.string().min(1).max(128),
  line2: z.string().max(128).optional(),
  postalCode: z.string().min(1).max(16).optional(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export type UpdateAddressInput = z.infer<typeof updateAddressInput>;

export const updateAddressOutput = z.object({
  place: place,
});

export type UpdateAddressOutput = z.infer<typeof updateAddressOutput>;

export const updateAmenitiesInput = z.object({
  id: z.string(),
  amenities: z.string().array(),
});

export type UpdateAmenitiesInput = z.infer<typeof updateAmenitiesInput>;

export const updateAmenitiesOutput = z.object({
  place: place,
});

export type UpdateAmenitiesOutput = z.infer<typeof updateAmenitiesOutput>;

export const updateHoursInput = z.object({
  id: z.string(),
  hours: z.record(z.string(), z.string()),
});

export type UpdateHoursInput = z.infer<typeof updateHoursInput>;

export const updateHoursOutput = z.object({
  place: place,
});

export type UpdateHoursOutput = z.infer<typeof updateHoursOutput>;
