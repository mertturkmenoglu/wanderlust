import { and, count, eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { db, listItems, lists } from '../../db';
import { CreateListDto, CreateListItemDto } from './dto';

export function getById(id: string) {
  return db.query.lists.findFirst({
    where: eq(lists.id, id),
    with: {
      user: true,
      items: {
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

  // Check how many lists user already has
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
      listId: listId,
    })
    .returning();

  return item;
}

export async function deleteListItem(
  userId: string,
  listId: string,
  locationId: string
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

  const [deleted] = await db
    .delete(listItems)
    .where(
      and(eq(listItems.listId, listId), eq(listItems.locationId, locationId))
    )
    .returning();

  return deleted;
}
