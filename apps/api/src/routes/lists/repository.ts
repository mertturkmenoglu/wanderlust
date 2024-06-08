import { and, count, eq, gt, gte, inArray, lte, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { db, listItems, lists, users } from '../../db';
import { CreateListDto, CreateListItemDto } from './dto';

export function getById(id: string) {
  return db.query.lists.findFirst({
    where: eq(lists.id, id),
    with: {
      user: true,
      items: {
        orderBy: (table, { asc }) => asc(table.index),
        with: {
          location: {
            with: {
              category: true,
            },
          },
        },
      },
    },
  });
}

export async function getUsersPublicLists(username: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    throw new HTTPException(404, {
      message: 'User not found',
    });
  }

  return db.query.lists.findMany({
    where: eq(lists.userId, user.id),
    orderBy: (table, { desc }) => desc(table.createdAt),
    with: {
      items: {
        orderBy: (table, { asc }) => asc(table.index),
        with: {
          location: {
            with: {
              category: true,
            },
          },
        },
      },
    },
  });
}

export async function create(userId: string, dto: CreateListDto) {
  // Check how many lists user already has
  const [{ value: totalLists }] = await db
    .select({ value: count() })
    .from(lists)
    .where(eq(lists.userId, userId));

  if (totalLists >= 128) {
    throw new HTTPException(400, {
      message: 'User has too many lists',
    });
  }

  const [list] = await db
    .insert(lists)
    .values({
      ...dto,
      userId,
    })
    .returning();

  return list;
}

export async function getMyLists(userId: string) {
  return db.query.lists.findMany({
    where: eq(lists.userId, userId),
    orderBy: (table, { desc }) => desc(table.createdAt),
    with: {
      items: {
        orderBy: (table, { asc }) => asc(table.index),
        with: {
          location: {
            with: {
              category: true,
            },
          },
        },
      },
    },
  });
}

export async function deleteList(userId: string, listId: string) {
  const list = await db.query.lists.findFirst({
    where: eq(lists.id, listId),
  });

  if (!list) {
    throw new HTTPException(404, {
      message: 'List not found',
    });
  }

  if (list.userId !== userId) {
    throw new HTTPException(403, {
      message: 'You do not have permission to delete this list',
    });
  }

  const deleted = await db.transaction(async (tx) => {
    const [res] = await tx
      .delete(lists)
      .where(and(eq(lists.userId, userId), eq(lists.id, listId)))
      .returning();

    await tx.delete(listItems).where(eq(listItems.listId, listId));

    return res;
  });

  return deleted;
}

export async function createListItem(
  userId: string,
  listId: string,
  dto: CreateListItemDto
) {
  const list = await db.query.lists.findFirst({
    where: eq(lists.id, listId),
  });

  if (!list) {
    throw new HTTPException(404, {
      message: 'List not found',
    });
  }

  if (list.userId !== userId) {
    throw new HTTPException(403, {
      message: 'You do not have permission to add items to this list',
    });
  }

  // Check how many items this list has
  const [{ value: totalListItems }] = await db
    .select({ value: count() })
    .from(listItems)
    .where(eq(listItems.listId, listId));

  if (totalListItems >= 512) {
    throw new HTTPException(400, {
      message: 'List has too many items',
    });
  }

  const dbItem = await db.query.listItems.findFirst({
    where: and(
      eq(listItems.listId, listId),
      eq(listItems.locationId, dto.locationId)
    ),
  });

  if (dbItem) {
    throw new HTTPException(400, {
      message: 'Item is already on the list',
    });
  }

  const [item] = await db
    .insert(listItems)
    .values({
      ...dto,
      listId,
      index: totalListItems,
    })
    .returning();

  return item;
}

export async function deleteListItem(
  userId: string,
  listId: string,
  itemId: string
) {
  const list = await db.query.lists.findFirst({
    where: eq(lists.id, listId),
  });

  if (!list) {
    throw new HTTPException(404, {
      message: 'List not found',
    });
  }

  if (list.userId !== userId) {
    throw new HTTPException(403, {
      message: 'You do not have permission to delete items from this list',
    });
  }

  const item = await db.query.listItems.findFirst({
    where: and(eq(listItems.listId, listId), eq(listItems.id, itemId)),
  });

  if (!item) {
    throw new HTTPException(404, {
      message: 'Item not found',
    });
  }

  const deleted = await db.transaction(async (tx) => {
    const [res] = await tx
      .delete(listItems)
      .where(and(eq(listItems.listId, listId), eq(listItems.id, itemId)))
      .returning();

    await tx
      .update(listItems)
      .set({
        index: sql`${listItems.index} - 1`,
      })
      .where(
        and(eq(listItems.listId, listId), gt(listItems.index, item.index))
      );

    return res;
  });

  return deleted;
}

export async function moveItemAfter(
  userId: string,
  listId: string,
  itemId: string,
  afterItemId: string
) {
  const list = await db.query.lists.findFirst({
    where: eq(lists.id, listId),
  });

  if (!list) {
    throw new HTTPException(404, {
      message: 'List not found',
    });
  }

  if (list.userId !== userId) {
    throw new HTTPException(403, {
      message: 'You do not have permission to move items on this list',
    });
  }

  const item = await db.query.listItems.findFirst({
    where: and(eq(listItems.listId, listId), eq(listItems.id, itemId)),
  });

  if (!item) {
    throw new HTTPException(404, {
      message: 'Item not found',
    });
  }

  const afterItem = await db.query.listItems.findFirst({
    where: and(eq(listItems.listId, listId), eq(listItems.id, afterItemId)),
  });

  if (!afterItem) {
    throw new HTTPException(404, {
      message: 'After item not found',
    });
  }

  if (item.index < afterItem.index) {
    await db.transaction(async (tx) => {
      await tx
        .update(listItems)
        .set({
          index: sql`${listItems.index} - 1`,
        })
        .where(
          and(
            eq(listItems.listId, listId),
            gte(listItems.index, item.index + 1),
            lte(listItems.index, afterItem.index)
          )
        );

      await tx
        .update(listItems)
        .set({
          index: afterItem.index,
        })
        .where(eq(listItems.id, item.id));
    });
  } else {
    await db.transaction(async (tx) => {
      await tx
        .update(listItems)
        .set({
          index: sql`${listItems.index} + 1`,
        })
        .where(
          and(
            eq(listItems.listId, listId),
            gte(listItems.index, afterItem.index + 1),
            lte(listItems.index, item.index - 1)
          )
        );

      await tx
        .update(listItems)
        .set({
          index: afterItem.index + 1,
        })
        .where(eq(listItems.id, item.id));
    });
  }
}

export async function itemListInfo(userId: string, locationId: string) {
  const usersLists = await db.query.lists.findMany({
    where: eq(lists.userId, userId),
  });

  const listIds = usersLists.map((list) => list.id);

  const items = await db.query.listItems.findMany({
    where: and(
      eq(listItems.locationId, locationId),
      inArray(listItems.listId, listIds)
    ),
  });

  return usersLists.map((list) => {
    return {
      id: list.id,
      name: list.name,
      includes: items.filter((item) => item.listId === list.id).length > 0,
    };
  });
}
