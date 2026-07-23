import type { CacheService } from '@wanderlust/cache';
import { Tokens } from '@wanderlust/common';
import { inject, injectable } from 'inversify';
import type { ActivityItem, ActivityType } from './types';
import { unshiftCapped } from './utilities';

@injectable()
export class ActivitiesService {
	constructor(@inject(Tokens.Cache) private readonly cache: CacheService) {}

	async addActivity(
		username: string,
		type: ActivityType,
		data: Record<string, unknown>,
	) {
		const activities = await this.getActivitiesByUsername(username);
		const newActivity: ActivityItem = {
			type,
			data,
			createdAt: new Date(),
		};

		const cappedActivities = unshiftCapped(activities, newActivity);

		await this.setActivitiesByUsername(username, cappedActivities);
	}

	private async getActivitiesByUsername(username: string) {
		return this.cache.namespace('activities').getOrSetForever({
			key: username,
			factory: async () => {
				return [] as ActivityItem[];
			},
		});
	}

	private async setActivitiesByUsername(
		username: string,
		activities: ActivityItem[],
	) {
		await this.cache.namespace('activities').setForever({
			key: username,
			value: activities,
		});
	}
}
