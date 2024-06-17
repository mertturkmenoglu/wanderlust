import { and, eq } from 'drizzle-orm';
import {
  Address,
  Media,
  cities,
  countries,
  db,
  locations,
  states,
} from '../../db';
import * as bookmarksRepository from '../bookmarks/repository';
import * as favoritesRepository from '../favorites/repository';
import { CreateLocationDto, PeekQueryDto, UpdateLocationDto } from './dto';

export async function peek(type: PeekQueryDto['type']) {
  if (type === 'favorite') {
    return db.query.locations.findMany({
      limit: 25,
      orderBy: (table, { desc }) => desc(table.totalFavorites),
      with: {
        category: true,
      },
    });
  }

  if (type === 'featured') {
    return db.query.locations.findMany({
      limit: 25,
      orderBy: (table, { desc }) => desc(table.totalPoints),
      with: {
        category: true,
      },
    });
  }

  if (type === 'popular') {
    return db.query.locations.findMany({
      limit: 25,
      orderBy: (table, { desc }) => desc(table.totalVotes),
      with: {
        category: true,
      },
    });
  }

  // Default to new
  return await db.query.locations.findMany({
    limit: 25,
    orderBy: (table, { desc }) => desc(table.createdAt),
    with: {
      category: true,
    },
  });
}

export async function getCountries() {
  return await db
    .select({
      id: countries.id,
      name: countries.name,
      iso2: countries.iso2,
    })
    .from(countries);
}

export async function getStates(countryId: number) {
  return await db
    .select({
      id: states.id,
      name: states.name,
      stateCode: states.stateCode,
    })
    .from(states)
    .where(eq(states.countryId, countryId));
}

export async function getCities(countryId: number, stateId: number) {
  return await db
    .select({
      id: cities.id,
      name: cities.name,
    })
    .from(cities)
    .where(and(eq(cities.stateId, stateId), eq(cities.countryId, countryId)));
}

export async function getById(id: string, userId?: string) {
  const location = await db.query.locations.findFirst({
    where: eq(locations.id, id),
    with: {
      category: true,
    },
  });
  const isBookmarked = userId
    ? await bookmarksRepository.isBookmarked(userId, id)
    : false;

  const isFavorite = userId
    ? await favoritesRepository.isFavorite(userId, id)
    : false;

  return { data: location, metadata: { isBookmarked, isFavorite } };
}

export async function create(dto: CreateLocationDto) {
  const [location] = await db
    .insert(locations)
    .values({
      ...dto,
      address: dto.address as Address,
      media: dto.media ? (dto.media as Media[]) : undefined,
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
      media: dto.media ? (dto.media as Media[]) : undefined,
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
