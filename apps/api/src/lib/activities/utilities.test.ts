import { describe, expect, test } from 'vitest';
import type { ActivityItem } from './types';
import { unshiftCapped } from './utilities';

describe('activities', () => {
	test('should add new activity to an empty array', () => {
		const activities: ActivityItem[] = [];
		const newActivity: ActivityItem = {
			type: 'create_favorite',
			data: {},
			createdAt: new Date(),
		};
		const cappedActivities = unshiftCapped(activities, newActivity);
		expect(cappedActivities[0]).toBe(newActivity);
	});

	test('should add new activity to an existing array', () => {
		const activities: ActivityItem[] = [
			{
				type: 'create_review',
				data: {},
				createdAt: new Date(),
			},
		];

		const newActivity: ActivityItem = {
			type: 'create_favorite',
			data: {},
			createdAt: new Date(),
		};

		const cappedActivities = unshiftCapped(activities, newActivity);
		const [firstActivity, secondActivity] = cappedActivities;
		const oldFirstActivity = activities[0];

		expect(firstActivity).toBe(newActivity);
		expect(secondActivity).toBe(oldFirstActivity);
	});

	test('should cap the activities array', () => {
		const activities: ActivityItem[] = Array.from({ length: 100 }, (_, i) => ({
			type: 'create_review',
			data: { index: i },
			createdAt: new Date(),
		}));

		const newActivity: ActivityItem = {
			type: 'create_favorite',
			data: {},
			createdAt: new Date(),
		};

		const cappedActivities = unshiftCapped(activities, newActivity);
		expect(cappedActivities.length).toBe(100);
		expect(cappedActivities[0]).toBe(newActivity);
	});
});
