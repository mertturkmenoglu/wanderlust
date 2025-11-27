import type { TDatabaseService } from "@/db";
import { ORPCError } from "@orpc/server";
import * as dto from "./dto";
import { and, eq } from "drizzle-orm";
import * as schema from "@/db/schema";

export class PlacesRepository {
  constructor(private readonly db: TDatabaseService) {}

  async get(data: dto.GetInput) {
    try {
      const place = await this.db.query.places.findFirst({
        where: (t) => eq(t.id, data.id),
        with: {
          address: true,
          category: true,
          assets: {
            where: (t) =>
              and(eq(t.entityId, data.id), eq(t.entityType, "place")),
            orderBy: (t, { asc }) => asc(t.order),
          },
        },
      });

      if (!place) {
        throw new ORPCError("NOT_FOUND", {
          message: `Place with ID ${data.id} not found`,
        });
      }

      return place;
    } catch (err) {
      if (err instanceof ORPCError) {
        throw err;
      }

      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to fetch place",
        cause: err,
      });
    }
  }

  async isFavorite(placeId: string, userId: string): Promise<boolean> {
    const fav = await this.db.query.favorites.findFirst({
      where: (t) => and(eq(t.placeId, placeId), eq(t.userId, userId)),
    });

    return fav !== undefined;
  }

  async isBookmarked(placeId: string, userId: string): Promise<boolean> {
    const bookmark = await this.db.query.bookmarks.findFirst({
      where: (t) => and(eq(t.placeId, placeId), eq(t.userId, userId)),
    });

    return bookmark !== undefined;
  }

  async peek() {
    try {
      const place = await this.db.query.places.findMany({
        with: {
          address: true,
          category: true,
          assets: true,
        },
        offset: 0,
        limit: 25,
        orderBy: (t, { desc }) => desc(t.createdAt),
      });

      return place;
    } catch (err) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to fetch places",
        cause: err,
      });
    }
  }

  async update(data: dto.UpdateInput) {
    const { id, ...updateData } = data;

    try {
      const [place] = await this.db
        .update(schema.places)
        .set(updateData)
        .where(eq(schema.places.id, id))
        .returning();

      if (!place) {
        throw new ORPCError("NOT_FOUND", {
          message: `Place with ID ${id} not found`,
        });
      }

      return this.get({ id: place.id });
    } catch (err) {
      if (err instanceof ORPCError) {
        throw err;
      }

      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to update place",
        cause: err,
      });
    }
  }

  async updateAddress(data: dto.UpdateAddressInput) {
    const { id, ...updateData } = data;

    try {
      const place = await this.get({ id });

      const [address] = await this.db
        .update(schema.addresses)
        .set(updateData)
        .where(eq(schema.addresses.id, place.addressId))
        .returning();

      if (!address) {
        throw new ORPCError("NOT_FOUND", {
          message: `Address for Place ID ${id} not found`,
        });
      }

      return this.get({ id: place.id });
    } catch (err) {
      if (err instanceof ORPCError) {
        throw err;
      }

      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to update place address",
        cause: err,
      });
    }
  }

  async updateAmenities(data: dto.UpdateAmenitiesInput) {
    const { id, ...updateData } = data;

    try {
      const [place] = await this.db
        .update(schema.places)
        .set(updateData)
        .where(eq(schema.places.id, id))
        .returning();

      if (!place) {
        throw new ORPCError("NOT_FOUND", {
          message: `Place with ID ${id} not found`,
        });
      }

      return this.get({ id: place.id });
    } catch (err) {
      if (err instanceof ORPCError) {
        throw err;
      }

      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to update place amenities",
        cause: err,
      });
    }
  }

  async updateHours(data: dto.UpdateHoursInput) {
    const { id, ...updateData } = data;

    try {
      const [place] = await this.db
        .update(schema.places)
        .set(updateData)
        .where(eq(schema.places.id, id))
        .returning();

      if (!place) {
        throw new ORPCError("NOT_FOUND", {
          message: `Place with ID ${id} not found`,
        });
      }

      return this.get({ id: place.id });
    } catch (err) {
      if (err instanceof ORPCError) {
        throw err;
      }

      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to update place hours",
        cause: err,
      });
    }
  }
}
