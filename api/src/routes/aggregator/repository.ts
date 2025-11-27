import type { TDatabaseService } from "@/db";
import { ORPCError } from "@orpc/client";
import { sql } from "drizzle-orm";

export class AggregatorRepository {
  constructor(private readonly db: TDatabaseService) {}

  async home() {
    try {
      const promises = await Promise.allSettled([
        this.getFeatured(),
        this.getPopular(),
        this.getNew(),
        this.getFavorites(),
      ]);

      if (promises.some((p) => p.status === "rejected")) {
        throw new Error("Failed to fetch aggregated data");
      }

      return {
        featured: promises[0].status === "fulfilled" ? promises[0].value : [],
        popular: promises[1].status === "fulfilled" ? promises[1].value : [],
        new: promises[2].status === "fulfilled" ? promises[2].value : [],
        favorites: promises[3].status === "fulfilled" ? promises[3].value : [],
      };
    } catch (err) {
      if (err instanceof ORPCError) {
        throw err;
      }

      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to fetch aggregated data",
        cause: err,
      });
    }
  }

  private async getFeatured() {
    try {
      const result = await this.db.query.places.findMany({
        where: (t, { ne }) => ne(t.totalVotes, 0),
        orderBy: (t, { desc }) => [
          sql`(${t.totalPoints} / ${t.totalVotes}) DESC`,
          desc(t.totalVotes),
        ],
        limit: 25,
        with: {
          address: true,
          category: true,
          assets: true,
        },
      });

      return result;
    } catch (err) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to fetch featured places",
        cause: err,
      });
    }
  }

  private async getPopular() {
    try {
      const result = await this.db.query.places.findMany({
        orderBy: (t, { desc }) => [desc(t.totalVotes)],
        limit: 25,
        with: {
          address: true,
          category: true,
          assets: true,
        },
      });

      return result;
    } catch (err) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to fetch popular places",
        cause: err,
      });
    }
  }

  private async getNew() {
    try {
      const result = await this.db.query.places.findMany({
        orderBy: (t, { desc }) => [desc(t.createdAt)],
        limit: 25,
        with: {
          address: true,
          category: true,
          assets: true,
        },
      });

      return result;
    } catch (err) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to fetch new places",
        cause: err,
      });
    }
  }

  private async getFavorites() {
    try {
      const result = await this.db.query.places.findMany({
        orderBy: (t, { desc }) => [desc(t.totalFavorites)],
        limit: 25,
        with: {
          address: true,
          category: true,
          assets: true,
        },
      });

      return result;
    } catch (err) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to fetch favorite places",
        cause: err,
      });
    }
  }
}
