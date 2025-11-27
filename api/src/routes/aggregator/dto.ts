import { $ } from "@/db/schema";
import z from "zod";

const place = $.place.extend({
  assets: $.asset.array(),
  category: $.category,
  address: $.address,
});

export const homeInput = z.object({});

export type HomeInput = z.infer<typeof homeInput>;

export const homeOutput = z.object({
  new: place.array(),
  popular: place.array(),
  featured: place.array(),
  favorites: place.array(),
});

export type HomeOutput = z.infer<typeof homeOutput>;
