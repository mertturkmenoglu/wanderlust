import { faker } from '@faker-js/faker';
import type { $insert } from '@wanderlust/common';
import * as schema from '@wanderlust/db';
import z from 'zod';
import { getDb } from './common';

const titles = [
	'Best Museum Award',
	"Editor's Choice",
	'Staff Pick',
	'Hidden Gem',
	'Local Favorite',
	'Must-Visit',
	"Curator's Selection",
	'Verified Excellence',
	'Best Trip Destination Award 2026',
	'Best New Opening 2026',
	'Top Rated Restaurant 2026',
	'Best Hotel Experience 2026',
	'Family - Friendly Destination of the Year',
	'Best Hidden Beach 2026',
	'Best Cultural Landmark 2026',
	'Most Romantic Getaway 2026',
	"This Week's Hot Entries",
	'Trending Now',
	'Rising Star',
	'Most Booked This Month',
	'Newly Added',
	'Seasonal Favorite',
	"Traveler's Top Pick",
	'Highly Reviewed',
	'Most Photographed',
	'Top 1 % Rated',
];

type Insert = z.infer<typeof $insert.accolade>;

const zSchema = z.string().slugify();

export async function generate() {
	const db = await getDb();

	const inserts: Insert[] = titles.map((title) => ({
		id: zSchema.parse(title),
		title,
		description: faker.lorem.paragraph(),
		badge: faker.image.avatarGitHub(),
		image: faker.image.url(),
	}))

	await db.insert(schema.accolades).values(inserts);
}
