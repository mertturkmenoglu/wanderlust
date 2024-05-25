import { eq } from "drizzle-orm";
import { Address, db, events } from "../../db";
import { CreateEventDto, UpdateEventDto } from "./dto";

export async function peek() {
  return await db.query.events.findMany({
    limit: 25,
    with: {
      organizer: true,
    },
  });
}

export async function getById(id: string) {
  return await db.query.events.findFirst({
    where: eq(events.id, id),
    with: {
      organizer: true,
    },
  });
}

export async function create(dto: CreateEventDto) {
  const [event] = await db
    .insert(events)
    .values({
      ...dto,
      address: dto.address as Address,
      tags: (dto.tags ?? []) as string[],
    })
    .returning();

  return event;
}

export async function update(id: string, dto: UpdateEventDto) {
  const [event] = await db
    .update(events)
    .set({
      ...dto,
      address: dto.address as Address,
      tags: dto.tags ? (dto.tags as string[]) : undefined,
    })
    .where(eq(events.id, id))
    .returning();

  return event;
}

export async function deleteEvent(id: string) {
  const [event] = await db.delete(events).where(eq(events.id, id)).returning();

  return event;
}
