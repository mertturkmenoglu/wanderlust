import { Tokens } from '@wanderlust/common';
import type { Lists } from '@wanderlust/contract';
import { type DatabaseService, schema } from '@wanderlust/db';
import { nanoid } from '@wanderlust/uid';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { ActivitiesService } from '@/lib/activities';
import { getUserIdOrThrow } from '@/lib/get-user-id';
import { invariant } from '@/lib/invariant';
import { MAX_LISTS_PER_USER } from '../shared/consts';
import { os } from '../shared/router';

@injectable()
export class CreateListMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(ActivitiesService) private readonly activities: ActivitiesService,
	) {}

	route() {
		return os.create.handler(async ({ input, context }) => {
			const userId = getUserIdOrThrow(context);
			const result = await this.execute(userId, input);

			return result;
		});
	}

	private async execute(
		userId: string,
		data: Lists.dto.CreateInput,
	): Promise<Lists.dto.CreateOutput> {
		const count = await this.db.$count(
			schema.lists,
			eq(schema.lists.userId, userId),
		);

		invariant(
			count < MAX_LISTS_PER_USER,
			'BAD_REQUEST',
			`You have reached the maximum number of lists (${MAX_LISTS_PER_USER})`,
		);

		const [result] = await this.db
			.insert(schema.lists)
			.values({
				id: nanoid(),
				userId: userId,
				name: data.name,
				isPublic: data.isPublic,
			})
			.returning();

		invariant(result, 'INTERNAL_SERVER_ERROR', 'No list returned');

		const list = await this.db.query.lists.findFirst({
			where: {
				id: result.id,
			},
			with: {
				user: {
					columns: {
						id: true,
						username: true,
						name: true,
						image: true,
					},
				},
			},
		});

		invariant(
			list,
			'INTERNAL_SERVER_ERROR',
			'Failed to retrieve the created list',
		);

		if (list.isPublic) {
			await this.activities.addActivity(list.user.username, 'create_list', {
				list: {
					id: list.id,
					name: list.name,
				},
			});
		}

		return {
			list,
		};
	}
}
