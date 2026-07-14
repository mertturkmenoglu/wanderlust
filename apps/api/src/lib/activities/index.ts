import { CacheService, type TCacheService } from '@wanderlust/cache';
import { inject, injectable } from 'inversify';
import type { ActivityItem, ActivityType } from './types';
import { unshiftCapped } from './utilities';

@injectable()
export class ActivitiesService {
	private readonly cache: TCacheService;

	constructor(@inject(CacheService) cache: CacheService) {
		this.cache = cache.get();
	}

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
