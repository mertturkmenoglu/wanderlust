import { and, count, eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { db, listItems, lists } from '../../db';
import { PaginationParams, getPagination } from '../../pagination';
import { CreateListDto, CreateListItemDto } from './dto';

export function getById(id: string) {
  return db.query.lists.findFirst({
    where: eq(lists.id, id),
    with: {
      user: true,
    },
  });
}

export async function create(userId: string, dto: CreateListDto) {
  const [list] = await db
    .insert(lists)
    .values({
      ...dto,
      userId,
    })
    .returning();

  return list;
}

export async function getMyLists(userId: string, pagination: PaginationParams) {
  const res = await db.query.lists.findMany({
    where: eq(lists.userId, userId),
    offset: pagination.offset,
    limit: pagination.pageSize,
    orderBy: (table, { desc }) => desc(table.createdAt),
  });

  const [{ value: totalRecords }] = await db
    .select({ value: count() })
    .from(lists)
    .where(eq(lists.userId, userId));

  return {
    data: res,
    pagination: getPagination(pagination, totalRecords),
  };
}

export async function getListItems(
  listId: string,
  pagination: PaginationParams,
  userId?: string
) {
  const list = await db.query.lists.findFirst({
    where: eq(lists.id, listId),
  });

  if (!list) {
    throw new HTTPException(404, {
      message: 'List not found',
    });
  }

  if (!list.isPublic && list.userId !== userId) {
    throw new HTTPException(403, {
      message: 'You do not have permission to view this list',
    });
  }

  const res = await db.query.listItems.findMany({
    where: eq(listItems.listId, listId),
    orderBy: (table, { desc }) => desc(table.createdAt),
    offset: pagination.offset,
    limit: pagination.pageSize,
    with: {
      location: {
        with: {
          category: true,
        },
      },
    },
  });

  const [{ value: totalRecords }] = await db
    .select({ value: count() })
    .from(listItems)
    .where(eq(listItems.listId, listId));

  return {
    data: res,
    pagination: getPagination(pagination, totalRecords),
  };
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
