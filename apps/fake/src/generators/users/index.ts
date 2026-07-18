import { faker } from '@faker-js/faker';
import type { Types } from '@wanderlust/common';
import { schema } from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import { usernames } from '@/fixtures/users';
import { getDb } from '@/lib/common';
import { defineGenerator } from '@/lib/define-generator';
import { Fake } from '@/lib/fake';
import { processChunk, processFollows } from './process';

type UserInsert = Types.Users.$Insert.User;
type AccountInsert = Types.Auth.$Insert.Account;

// This value is meant to be used in fake user generation only.
// const defaultPassword = 'LoremIpsum!1';
const defaultHashedPassword =
	'425888cecbaf3efe7aaf8f8b581cb51b:e2c81681350ebaa0fd8477a742db3516fda6de9693991660b433290ee01a6a84ed63975f3cf996d84d4915cbc5137331f1212c325d695c8830096e28066bf670';

const COUNT = 2_000;
const STEP = 1_000;

export const usersGenerator = defineGenerator({
	generate: async () => {
		let step = STEP;
		const db = await getDb();

		for (let i = 0; i < COUNT; i += step) {
			if (i + step >= COUNT) {
				step = COUNT - i;
			}

			const userBatch: UserInsert[] = [];
			const accountBatch: AccountInsert[] = [];

			for (let j = 0; j < step; j++) {
				const sex = Math.random() > 0.5 ? 'female' : 'male';
				const firstName = faker.person.firstName(sex).slice(0, 14);
				const lastName = faker.person.lastName(sex).slice(0, 14);
				const emailBase = faker.internet.email({
					firstName,
					lastName,
					allowSpecialCharacters: false,
				});
				const emailRandomness = faker.string.alpha(4);
				const email = `${emailRandomness}${emailBase}`;
				const usernameBase = faker.internet.username({ firstName, lastName });
				const usernameRandomness = faker.string.alpha(4);
				const username = `${usernameBase}${usernameRandomness}`;
				const image = faker.image.personPortrait({ sex });
				const name = `${firstName} ${lastName}`;
				const userId = nanoid();

				userBatch.push({
					id: userId,
					email: email,
					username: username,
					name: name,
					image: image,
					role: username === 'hilal' ? 'admin' : 'user',
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

		// After all users are created, insert test users with known credentials
		// for development and testing purposes.
		await db.transaction(async (tx) => {
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
	},
});

export const followsGenerator = defineGenerator({
	generate: async () => {
		const users = await Fake.File.read('users');
		const chunks = Fake.Chunk.fromArray(users, 100);

		const r1 = await Promise.allSettled(
			chunks.map((c) => processChunk(c, users)),
		);

		void Fake.Promise.allMustSettle(r1);

		const r2 = await Promise.allSettled(chunks.map((c) => processFollows(c)));

		void Fake.Promise.allMustSettle(r2);

		const db = await getDb();

		const wellKnownUsers = await db.query.users.findMany({
			where: {
				username: {
					in: usernames,
				},
			},
			columns: {
				id: true,
			},
		});

		const wellKnownUserIds = wellKnownUsers.map((x) => x.id);

		try {
			await processChunk(wellKnownUserIds, wellKnownUserIds);
		} catch {}

		try {
			await processFollows(wellKnownUserIds);
		} catch {}
	},
});
