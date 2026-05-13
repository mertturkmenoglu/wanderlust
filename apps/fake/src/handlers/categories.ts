import type { $insert } from '@wanderlust/common';
import * as schema from '@wanderlust/db';
import type z from 'zod';
import { getDb } from './common';

type Insert = z.infer<typeof $insert.category>;

const data: Insert[] = [
	{
		id: 1,
		name: 'Coffee shops',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/coffee-shops.jpg',
	},
	{
		id: 2,
		name: 'Restaurants',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/restaurants.jpg',
	},
	{
		id: 3,
		name: 'Bookstores',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/bookstores.jpg',
	},
	{
		id: 4,
		name: 'Natural landmarks',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/natural-landmarks.jpg',
	},
	{
		id: 5,
		name: 'Breweries',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/breweries.jpg',
	},
	{
		id: 6,
		name: 'Bars & Clubs',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/bars-and-clubs.jpg',
	},
	{
		id: 7,
		name: 'Community Hubs',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/community-hubs.jpg',
	},
	{
		id: 8,
		name: 'Coworking spaces',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/coworking-spaces.jpg',
	},
	{
		id: 9,
		name: 'Wellness centers',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/wellness-centers.jpg',
	},
	{
		id: 10,
		name: 'Photography spots',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/photography-spots.jpg',
	},
	{
		id: 11,
		name: 'Artisanal bakeries',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/artisanal-bakeries.jpg',
	},
	{
		id: 12,
		name: 'Street art and murals',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/street-art-and-murals.jpg',
	},
	{
		id: 13,
		name: 'Art galleries',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/art-galleries.jpg',
	},
	{
		id: 14,
		name: 'Art fairs',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/art-fairs.jpg',
	},
	{
		id: 15,
		name: 'Museums',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/museums.jpg',
	},
	{
		id: 16,
		name: 'Arts & Theater',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/arts-and-theater.jpg',
	},
	{
		id: 17,
		name: 'Hotels',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/hotels.jpg',
	},
	{
		id: 18,
		name: 'Places to Stay',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/places-to-stay.jpg',
	},
	{
		id: 19,
		name: 'Street food vendors',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/street-food-vendors.jpg',
	},
	{
		id: 20,
		name: 'Workshops',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/workshops.jpg',
	},
	{
		id: 21,
		name: 'Specialty shops (antique stores, comic book stores)',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/specialty-shops.jpg',
	},
	{
		id: 22,
		name: 'Famous filming locations',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/famous-filming-locations.jpg',
	},
	{
		id: 23,
		name: 'Tourist Attractions',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/media/tourist-attractions.jpg',
	},
];

export async function generate() {
	const db = await getDb();

	await db.insert(schema.categories).values(data);
}
