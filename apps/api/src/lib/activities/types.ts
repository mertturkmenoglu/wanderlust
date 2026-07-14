export type ActivityType =
	| 'create_favorite'
	| 'create_list'
	| 'create_review'
	| 'create_trip'
	| 'follow'
	| 'like_review';

export type ActivityData = Record<string, unknown>;

export type ActivityItem = {
	type: ActivityType;
	data: ActivityData;
	createdAt: Date;
};
