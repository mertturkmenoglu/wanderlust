import type { TDatabaseService } from "@/db";
import * as dto from "./dto";
import { ORPCError } from "@orpc/server";
import { Pagination } from "@/lib/pagination";
import * as schema from "@/db/schema";
import { and, eq, gt, sql } from "drizzle-orm";
import { nanoid } from "@/lib/uid";
import { MAX_ITEMS_PER_LIST } from "./consts";

export class ListsRepository {
  constructor(private readonly db: TDatabaseService) {}

  async listAll(userId: string, data: dto.ListAllInput) {
    const offset = Pagination.getOffset(data);

    try {
      const result = await this.db.query.lists.findMany({
        where: (t, { eq }) => eq(t.userId, userId),
        orderBy: (t, { desc }) => desc(t.createdAt),
        offset: offset,
        limit: data.pageSize,
        with: {
          user: {
            columns: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
        },
      });

      const totalRecords = await this.db.$count(
        schema.lists,
        eq(schema.lists.userId, userId)
      );

      return {
        lists: result,
        pagination: Pagination.compute(data, totalRecords),
      };
    } catch (err) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to list all lists",
        cause: err,
      });
    }
  }

  async listPublic(data: dto.ListPublicInput) {
    const offset = Pagination.getOffset(data);

    try {
      const user = await this.db.query.users.findFirst({
        where: (t, { eq }) => eq(t.username, data.username),
      });

      if (!user) {
        throw new ORPCError("NOT_FOUND", {
          message: `User with username '${data.username}' not found`,
        });
      }

      const result = await this.db.query.lists.findMany({
        where: (t, { eq, and }) =>
          and(eq(t.userId, user.id), eq(t.isPublic, true)),
        orderBy: (t, { desc }) => desc(t.createdAt),
        offset: offset,
        limit: data.pageSize,
        with: {
          user: {
            columns: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
        },
      });

      const totalRecords = await this.db.$count(
        schema.lists,
        and(eq(schema.lists.userId, user.id), eq(schema.lists.isPublic, true))
      );

      return {
        lists: result,
        pagination: Pagination.compute(data, totalRecords),
      };
    } catch (err) {
      if (err instanceof ORPCError) {
        throw err;
      }

      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to list public lists",
        cause: err,
      });
    }
  }

  async get(userId: string, data: dto.GetInput) {
    try {
      const result = await this.db.query.lists.findFirst({
        where: (t, { eq }) => eq(t.id, data.id),
        with: {
          user: {
            columns: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
          items: {
            orderBy: (t, { asc }) => asc(t.index),
            with: {
              place: {
                with: {
                  address: true,
                  category: true,
                  assets: true,
                },
              },
            },
          },
        },
      });

      if (!result) {
        throw new ORPCError("NOT_FOUND", {
          message: `List with ID '${data.id}' not found`,
        });
      }

      if (result.userId !== userId && !result.isPublic) {
        throw new ORPCError("FORBIDDEN", {
          message: `You do not have access to list with ID '${data.id}'`,
        });
      }

      return {
        list: result,
      };
    } catch (err) {
      if (err instanceof ORPCError) {
        throw err;
      }

      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to get list",
        cause: err,
      });
    }
  }

  async checkStatus(userId: string, data: dto.CheckStatusInput) {
    try {
      const listIds = await this.db.query.lists.findMany({
        where: (t, { eq }) => eq(t.userId, userId),
        columns: {
          id: true,
          name: true,
        },
      });

      const statuses = await this.db.query.listItems.findMany({
        where: (t, { eq, and, inArray }) =>
          and(
            eq(t.placeId, data.placeId),
            inArray(
              t.listId,
              listIds.map((l) => l.id)
            )
          ),
        columns: {
          listId: true,
        },
      });

      const mapped = listIds.map((l) => ({
        id: l.id,
        name: l.name,
        includes: statuses.some((s) => s.listId === l.id),
      }));

      return {
        statuses: mapped,
      };
    } catch (err) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to check list status",
        cause: err,
      });
    }
  }

  async create(userId: string, data: dto.CreateInput) {
    try {
      const [result] = await this.db
        .insert(schema.lists)
        .values({
          id: nanoid(),
          userId: userId,
          name: data.name,
          isPublic: data.isPublic,
        })
        .returning();

      if (!result) {
        throw new Error("No list returned after insertion");
      }

      const list = await this.db.query.lists.findFirst({
        where: (t, { eq }) => eq(t.id, result.id),
        with: {
          user: {
            columns: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (!list) {
        throw new Error("Failed to retrieve the created list");
      }

      return {
        list,
      };
    } catch (err) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to create list",
        cause: err,
      });
    }
  }

  async update(userId: string, data: dto.UpdateInput) {
    try {
      const existing = await this.db.query.lists.findFirst({
        where: (t, { eq }) => eq(t.id, data.id),
      });

      if (!existing) {
        throw new ORPCError("NOT_FOUND", {
          message: `List with ID '${data.id}' not found`,
        });
      }

      if (existing.userId !== userId) {
        throw new ORPCError("FORBIDDEN", {
          message: `You do not have permission to update list with ID '${data.id}'`,
        });
      }

      const [updated] = await this.db
        .update(schema.lists)
        .set({
          name: data.name,
          isPublic: data.isPublic,
        })
        .where(eq(schema.lists.id, data.id))
        .returning();

      if (!updated) {
        throw new Error("No list returned after update");
      }

      const list = await this.db.query.lists.findFirst({
        where: (t, { eq }) => eq(t.id, updated.id),
        with: {
          user: {
            columns: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (!list) {
        throw new Error("Failed to retrieve the updated list");
      }

      return {
        list,
      };
    } catch (err) {
      if (err instanceof ORPCError) {
        throw err;
      }

      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to update list",
        cause: err,
      });
    }
  }

  async _delete(userId: string, data: dto.DeleteInput) {
    try {
      const existing = await this.db.query.lists.findFirst({
        where: (t, { eq }) => eq(t.id, data.id),
      });

      if (!existing) {
        throw new ORPCError("NOT_FOUND", {
          message: `List with ID '${data.id}' not found`,
        });
      }

      if (existing.userId !== userId) {
        throw new ORPCError("FORBIDDEN", {
          message: `You do not have permission to delete list with ID '${data.id}'`,
        });
      }

      await this.db.delete(schema.lists).where(eq(schema.lists.id, data.id));
    } catch (err) {
      if (err instanceof ORPCError) {
        throw err;
      }

      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to delete list",
        cause: err,
      });
    }
  }

  async appendItem(userId: string, data: dto.AppendItemInput) {
    try {
      const existing = await this.db.query.lists.findFirst({
        where: (t, { eq }) => eq(t.id, data.id),
      });

      if (!existing) {
        throw new ORPCError("NOT_FOUND", {
          message: `List with ID '${data.id}' not found`,
        });
      }

      if (existing.userId !== userId) {
        throw new ORPCError("FORBIDDEN", {
          message: `You do not have permission to modify list with ID '${data.id}'`,
        });
      }

      let lastIndex = await this.db.query.listItems.findFirst({
        where: (t, { eq }) => eq(t.listId, data.id),
        orderBy: (t, { desc }) => desc(t.index),
        columns: {
          index: true,
        },
      });

      if (!lastIndex) {
        lastIndex = { index: -1 };
      }

      if (lastIndex.index >= MAX_ITEMS_PER_LIST) {
        throw new ORPCError("BAD_REQUEST", {
          message: `List with ID '${data.id}' has reached the maximum number of items (${MAX_ITEMS_PER_LIST})`,
        });
      }

      const [result] = await this.db
        .insert(schema.listItems)
        .values({
          listId: data.id,
          placeId: data.placeId,
          index: lastIndex.index + 1,
        })
        .returning();

      if (!result) {
        throw new Error("No list item returned after insertion");
      }

      const listItem = await this.db.query.listItems.findFirst({
        where: (t, { eq }) =>
          and(eq(t.listId, result.listId), eq(t.placeId, result.placeId)),
        with: {
          place: {
            with: {
              address: true,
              category: true,
              assets: true,
            },
          },
        },
      });

      if (!listItem) {
        throw new Error("Failed to retrieve the created list item");
      }

      return {
        item: listItem,
      };
    } catch (err) {
      if (err instanceof ORPCError) {
        throw err;
      }

      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to append item to list",
        cause: err,
      });
    }
  }

  async updateItems(userId: string, data: dto.UpdateItemsInput) {
    try {
      const list = await this.db.query.lists.findFirst({
        where: (t, { eq }) => eq(t.id, data.id),
      });

      if (!list) {
        throw new ORPCError("NOT_FOUND", {
          message: `List with ID '${data.id}' not found`,
        });
      }

      if (list.userId !== userId) {
        throw new ORPCError("FORBIDDEN", {
          message: `You do not have permission to modify list with ID '${data.id}'`,
        });
      }

      if (data.placeIds.length > MAX_ITEMS_PER_LIST) {
        throw new ORPCError("BAD_REQUEST", {
          message: `Cannot have more than ${MAX_ITEMS_PER_LIST} items in a list`,
        });
      }

      await this.db.transaction(async (tx) => {
        // Delete existing items
        await tx
          .delete(schema.listItems)
          .where(eq(schema.listItems.listId, data.id));

        // Insert new items
        await tx.insert(schema.listItems).values(
          data.placeIds.map((placeId, index) => ({
            listId: data.id,
            placeId: placeId,
            index: index,
          }))
        );
      });

      const updatedList = await this.db.query.lists.findFirst({
        where: (t, { eq }) => eq(t.id, data.id),
        with: {
          user: {
            columns: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (!updatedList) {
        throw new Error("Failed to retrieve the updated list");
      }

      return {
        list: updatedList,
      };
    } catch (err) {
      if (err instanceof ORPCError) {
        throw err;
      }

      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to update items in list",
        cause: err,
      });
    }
  }

  async removeItem(userId: string, data: dto.RemoveItemInput) {
    try {
      const list = await this.db.query.lists.findFirst({
        where: (t, { eq }) => eq(t.id, data.id),
      });

      if (!list) {
        throw new ORPCError("NOT_FOUND", {
          message: `List with ID '${data.id}' not found`,
        });
      }

      if (list.userId !== userId) {
        throw new ORPCError("FORBIDDEN", {
          message: `You do not have permission to modify list with ID '${data.id}'`,
        });
      }

      await this.db.transaction(async (tx) => {
        // Delete the item
        const result = await tx
          .delete(schema.listItems)
          .where(
            and(
              eq(schema.listItems.listId, data.id),
              eq(schema.listItems.placeId, data.placeId)
            )
          )
          .returning();

        if (result.length !== 1) {
          throw new ORPCError("NOT_FOUND", {
            message: `Item with Place ID '${data.placeId}' not found in list with ID '${data.id}'`,
          });
        }

        // Get item
        const item = result[0]!;

        // Update indices of remaining items
        await tx
          .update(schema.listItems)
          .set({
            index: sql`${schema.listItems.index} - 1`,
          })
          .where(
            and(
              eq(schema.listItems.listId, data.id),
              gt(schema.listItems.index, item.index)
            )
          );
      });
    } catch (err) {
      if (err instanceof ORPCError) {
        throw err;
      }

      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to remove item from list",
        cause: err,
      });
    }
  }
}
