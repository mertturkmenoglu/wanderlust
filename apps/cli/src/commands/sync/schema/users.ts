import * as schema from '@wanderlust/db';
import { isCollectionExistsError } from '../utils/err-utils';
import { AbstractSchema } from './abstract-schema';

export class UsersSchema extends AbstractSchema {
	override async createCollection() {
		try {
			await this.client.collections().create({
				name: this.name,
				enable_nested_fields: true,
				fields: [
					{
						name: 'id',
						type: 'string',
					},
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'username',
						type: 'string',
					},
					{
						name: 'image',
						type: 'string',
						optional: true,
					},
				],
			});
		} catch (err) {
			if (isCollectionExistsError(err)) {
				console.log(
					`Collection ${this.name} already exists, skipping creation`,
				);
				return;
			}

			throw err;
		}
	}

	override async sync() {
		await this.deleteCollection();

		await this.createCollection();

		const count = await this.db.$count(schema.users);
		const step = 1000;

		for (let i = 0; i < count; i += step) {
			const users = await this.db.query.users.findMany({
				orderBy: (t, { asc }) => [asc(t.createdAt), asc(t.name)],
				limit: step,
				offset: i,
				columns: {
					id: true,
					name: true,
					username: true,
					image: true,
					createdAt: true,
				},
			});

			const docs = users.map((user) => ({
				id: user.id,
				name: user.name,
				username: user.username,
				image: user.image,
			}));

			await this.client.collections(this.name).documents().import(docs, {
				action: 'upsert',
			});
		}
	}
}
