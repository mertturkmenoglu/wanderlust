import { faker } from '@faker-js/faker';
import type { $insert } from '@wanderlust/common';
import * as schema from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import type z from 'zod';
import { getDb } from './common';

// This value is meant to be used in fake user generation only.
// const defaultPassword = 'LoremIpsum!1';
const defaultHashedPassword =
	'425888cecbaf3efe7aaf8f8b581cb51b:e2c81681350ebaa0fd8477a742db3516fda6de9693991660b433290ee01a6a84ed63975f3cf996d84d4915cbc5137331f1212c325d695c8830096e28066bf670';

const COUNT = 2_000;
const STEP = 1_000;

type UserInsert = z.infer<typeof $insert.user>;
type AccountInsert = z.infer<typeof $insert.account>;

export async function generate() {
	let step = STEP;
	const db = await getDb();

	for (let i = 0; i < COUNT; i += step) {
		if (i + step >= COUNT) {
			step = COUNT - i;
		}

		const userBatch: UserInsert[] = [];
		const accountBatch: AccountInsert[] = [];

		for (let j = 0; j < step; j++) {
			const firstName = faker.person.firstName();
			const lastName = faker.person.lastName();
			const emailBase = faker.internet.email({
				firstName,
				lastName,
				allowSpecialCharacters: false,
			});
			const emailRandomness = faker.string.alpha(5);
			const email = `${emailRandomness}${emailBase}`;
			const usernameBase = faker.internet.username({ firstName, lastName });
			const usernameRandomness = faker.string.alpha(4);
			const username = `${usernameBase}${usernameRandomness}`;
			const image = faker.image.personPortrait();
			const name = `${firstName} ${lastName}`;
			const userId = nanoid();

			userBatch.push({
				id: userId,
				email: email,
				username: username,
				name: name,
				image: image,
				emailVerified: faker.datatype.boolean(),
				banner: null,
				bio: faker.lorem.sentence(),
				website: faker.internet.url(),
			});

			accountBatch.push({
				id: nanoid(),
				userId: userId,
				accountId: userId,
				createdAt: new Date(),
				providerId: 'credential',
				updatedAt: new Date(),
				password: defaultHashedPassword,
			});
		}

		await db.transaction(async (tx) => {
			await tx.insert(schema.users).values(userBatch);
			await tx.insert(schema.accounts).values(accountBatch);
		});
	}

	// After all users are created, insert a test user with known credentials
	// for development and testing purposes.
	await db.transaction(async (tx) => {
		const usernames = ['esin', 'hilal', 'lidya', 'mina', 'sueda', 'zoktay'];

		for (const username of usernames) {
			const userId = nanoid();

			await tx.insert(schema.users).values({
				id: userId,
				email: `${username}@test.com`,
				username: username,
				name: `${username[0]?.toUpperCase() + username.slice(1)}`,
				image:
					'https://live.staticflickr.com/65535/51840725161_6bab540eea_b.jpg',
				emailVerified: true,
				banner: faker.image.urlPicsumPhotos(),
				bio: faker.lorem.sentence(),
				website: faker.internet.url(),
			});

			await tx.insert(schema.accounts).values({
				id: nanoid(),
				userId: userId,
				accountId: userId,
				createdAt: new Date(),
				providerId: 'credential',
				updatedAt: new Date(),
				password: defaultHashedPassword,
			});
		}
	});
}
