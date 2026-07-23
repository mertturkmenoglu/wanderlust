import { Tokens } from '@wanderlust/common';
import type { Users } from '@wanderlust/contract';
import type { DatabaseService } from '@wanderlust/db';
import { inject, injectable } from 'inversify';
import { ActivitiesService } from '@/lib/activities';
import { invariant } from '@/lib/invariant';
import { os } from '../shared/router';
import { findUserByUsername } from '../shared/statements';

@injectable()
export class ListActivitiesMethod {
	constructor(
		@inject(Tokens.Database) private readonly db: DatabaseService,
		@inject(ActivitiesService) private readonly activities: ActivitiesService,
	) {}

	route() {
		return os.listActivities.handler(async ({ input }) => {
			const result = await this.execute(input);

			return result;
		});
	}

	private async execute(
		data: Users.dto.ListUserActivitiesInput,
	): Promise<Users.dto.ListUserActivitiesOutput> {
		const user = await findUserByUsername.execute(this.db, {
			username: data.username,
		});

		invariant(
			user,
			'NOT_FOUND',
			`User with username ${data.username} not found`,
		);

		const activities = await this.activities.getActivitiesByUsername(
			user.username,
		);

		return {
			activities,
		};
	}
}
