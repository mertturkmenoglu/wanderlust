import { $ } from "@/db/schema";
import { Pagination } from "@/lib/pagination";
import z from "zod";

const review = $.review.extend({
  user: $.user.pick({
    id: true,
    username: true,
    name: true,
    image: true,
  }),
  assets: $.asset.array(),
});

const place = $.place.extend({
  assets: $.asset.array(),
  category: $.category,
  address: $.address,
});

export const getInput = $.review.pick({
  id: true,
});

export type GetInput = z.infer<typeof getInput>;

export const getOutput = z.object({
  review: review.extend({
    place: place,
  }),
});

export type GetOutput = z.infer<typeof getOutput>;

const fileSchema = z
  .file()
  .max(1024 * 1024 * 5, "File size must be less than 5MB"); // 5 MB

export const createInput = $.review
  .pick({
    placeId: true,
    content: true,
    rating: true,
  })
  .extend({
    files: fileSchema.array().max(4, "You can upload up to 4 files").optional(),
  });

export type CreateInput = z.infer<typeof createInput>;

export const createOutput = z.object({
  review: review,
});

export type CreateOutput = z.infer<typeof createOutput>;

export const deleteInput = $.review.pick({
  id: true,
});

export type DeleteInput = z.infer<typeof deleteInput>;

export const deleteOutput = z.object({});

export type DeleteOutput = z.infer<typeof deleteOutput>;

export const listByUsernameInput = Pagination.queryParamsSchema.extend(
  $.user.pick({ username: true }).shape
);

export type ListByUsernameInput = z.infer<typeof listByUsernameInput>;

export const listByUsernameOutput = z.object({
  reviews: review
    .extend({
      place: place,
    })
    .array(),
  pagination: Pagination.schema,
});

export type ListByUsernameOutput = z.infer<typeof listByUsernameOutput>;

export const listByPlaceIdInput = Pagination.queryParamsSchema
  .extend($.place.pick({ id: true }).shape)
  .extend(
    z.object({
      sortBy: z
        .enum(["created_at", "rating"])
        .optional()
        .meta({
          description: "Field to sort by",
          examples: ["created_at", "rating"],
        }),
      sortOrd: z
        .enum(["asc", "desc"])
        .optional()
        .meta({
          description: "Sort order",
          examples: ["asc", "desc"],
        }),
      minRating: z
        .number()
        .int()
        .min(1)
        .max(5)
        .optional()
        .meta({
          description: "Minimum rating filter",
          examples: [3, 4],
        }),
      maxRating: z
        .number()
        .int()
        .min(1)
        .max(5)
        .optional()
        .meta({
          description: "Maximum rating filter",
          examples: [4, 5],
        }),
    }).shape
  );

export type ListByPlaceIdInput = z.infer<typeof listByPlaceIdInput>;

export const listByPlaceIdOutput = z.object({
  reviews: review.array(),
  pagination: Pagination.schema,
});

export type ListByPlaceIdOutput = z.infer<typeof listByPlaceIdOutput>;

export const getRatingsInput = $.place.pick({
  id: true,
});

export type GetRatingsInput = z.infer<typeof getRatingsInput>;

export const getRatingsOutput = z.object({
  ratings: z.record(z.number().int().min(1).max(5), z.number().int()).meta({
    description: "A mapping of rating values to their respective counts",
    examples: [
      {
        5: 10,
        4: 5,
        3: 2,
        2: 1,
        1: 0,
      },
    ],
  }),
  totalVotes: z
    .number()
    .int()
    .meta({
      description: "Total number of votes",
      examples: [18],
    }),
});

export type GetRatingsOutput = z.infer<typeof getRatingsOutput>;

export const listAssetsByPlaceIdInput = $.place.pick({
  id: true,
});

export type ListAssetsByPlaceIdInput = z.infer<typeof listAssetsByPlaceIdInput>;

export const listAssetsByPlaceIdOutput = z.object({
  assets: $.asset.array(),
});

export type ListAssetsByPlaceIdOutput = z.infer<
  typeof listAssetsByPlaceIdOutput
>;
