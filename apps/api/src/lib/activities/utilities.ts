import type { ActivityItem } from './types';

export function unshiftCapped(
	activities: ActivityItem[],
	activity: ActivityItem,
	cap = 100,
) {
	const newActivities = [...activities];
	newActivities.unshift(activity);
	return newActivities.slice(0, cap);
}
