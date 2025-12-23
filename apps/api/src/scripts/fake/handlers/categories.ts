import type z from 'zod';
import { DbProvider } from '@/db';
import type { $insert } from '@/db/schema';
import * as schema from '@/db/schema';
import { ioc } from '@/ioc';

type Insert = z.infer<typeof $insert.category>;

const data: Insert[] = [
	{
		id: 1,
		name: 'Coffee shops',
		image: 'https://images.unsplash.com/photo-1507915135761-41a0a222c709',
	},
	{
		id: 2,
		name: 'Restaurants',
		image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9',
	},
	{
		id: 3,
		name: 'Bookstores',
		image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7',
	},
	{
		id: 4,
		name: 'Natural landmarks',
		image: 'https://images.unsplash.com/photo-1597290282695-edc43d0e7129',
	},
	{
		id: 5,
		name: 'Breweries',
		image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2',
	},
	{
		id: 6,
		name: 'Bars & Clubs',
		image: 'https://images.unsplash.com/photo-1627686973009-0de79c0c3f6b',
	},
	{
		id: 7,
		name: 'Community Hubs',
		image: 'https://images.unsplash.com/photo-1697719074506-30fc25fed9c5',
	},
	{
		id: 8,
		name: 'Coworking spaces',
		image: 'https://images.unsplash.com/photo-1511018556340-d16986a1c194',
	},
	{
		id: 9,
		name: 'Wellness centers',
		image: 'https://images.unsplash.com/photo-1540929819775-fcc7d4649250',
	},
	{
		id: 10,
		name: 'Photography spots',
		image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597',
	},
	{
		id: 11,
		name: 'Artisanal bakeries',
		image: 'https://images.unsplash.com/photo-1627686973009-0de79c0c3f6b',
	},
	{
		id: 12,
		name: 'Street art and murals',
		image: 'https://images.unsplash.com/photo-1697719074506-30fc25fed9c5',
	},
	{
		id: 13,
		name: 'Art galleries',
		image: 'https://images.unsplash.com/photo-1485182708500-e8f1f318ba72',
	},
	{
		id: 14,
		name: 'Art fairs',
		image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2',
	},
	{
		id: 15,
		name: 'Museums',
		image: 'https://images.unsplash.com/photo-1627686973009-0de79c0c3f6b',
	},
	{
		id: 16,
		name: 'Arts & Theater',
		image: 'https://images.unsplash.com/photo-1697719074506-30fc25fed9c5',
	},
	{
		id: 17,
		name: 'Hotels',
		image: 'https://images.unsplash.com/photo-1485182708500-e8f1f318ba72',
	},
	{
		id: 18,
		name: 'Places to Stay',
		image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2',
	},
	{
		id: 19,
		name: 'Street food vendors',
		image: 'https://images.unsplash.com/photo-1627686973009-0de79c0c3f6b',
	},
	{
		id: 20,
		name: 'Workshops',
		image: 'https://images.unsplash.com/photo-1697719074506-30fc25fed9c5',
	},
	{
		id: 21,
		name: 'Specialty shops (antique stores, comic book stores)',
		image: 'https://images.unsplash.com/photo-1485182708500-e8f1f318ba72',
	},
	{
		id: 22,
		name: 'Famous filming locations',
		image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2',
	},
	{
		id: 23,
		name: 'Tourist Attractions',
		image: 'https://images.unsplash.com/photo-1697719074506-30fc25fed9c5',
	},
];

export async function generate() {
	const db = ioc.resolve(DbProvider.id);

	await db.insert(schema.categories).values(data);
}
