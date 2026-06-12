import { CacheService, type TCacheService } from '@wanderlust/cache';
import { inject, injectable } from 'inversify';

export type ActivityType =
	| 'create_favorite'
	| 'create_list'
	| 'create_review'
	| 'create_trip'
	| 'follow';

export type ActivityData = Record<string, unknown>;

export type ActivityItem = {
	type: ActivityType;
	data: ActivityData;
	createdAt: Date;
};

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
		const activities = await this.cache
			.namespace('activities')
			.getOrSetForever({
				key: username,
				factory: async () => {
					return [] as ActivityItem[];
				},
			});

		activities.unshift({
			type,
			data,
			createdAt: new Date(),
		});

		await this.cache.namespace('activities').set({
			key: username,
			value: activities.slice(0, 100),
		});
	}
}
