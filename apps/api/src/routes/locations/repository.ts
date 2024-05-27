import { eq } from 'drizzle-orm';
import { Address, db, locations } from '../../db';
import { CreateLocationDto, UpdateLocationDto } from './dto';

export async function peek() {
  return await db.query.locations.findMany({
    limit: 25,
    with: {
      category: true,
    },
  });
}

export async function getById(id: string) {
  return await db.query.locations.findFirst({
    where: eq(locations.id, id),
    with: {
      category: true,
    },
  });
}

export async function create(dto: CreateLocationDto) {
  const [location] = await db
    .insert(locations)
    .values({
      ...dto,
      address: dto.address as Address,
      tags: dto.tags ? (dto.tags as string[]) : undefined,
    })
    .returning();

  return location;
}

export async function update(id: string, dto: UpdateLocationDto) {
  const [location] = await db
    .update(locations)
    .set({
      ...dto,
      address: dto.address as Address,
      tags: (dto.tags ?? []) as string[],
    })
    .where(eq(locations.id, id))
    .returning();

  return location;
}

export async function deleteLocation(id: string) {
  const [location] = await db
    .delete(locations)
    .where(eq(locations.id, id))
    .returning();

  return location;
}
