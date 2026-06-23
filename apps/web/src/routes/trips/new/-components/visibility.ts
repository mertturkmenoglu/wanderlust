export const visibility = ['public', 'friends', 'private'] as const;

export type Visibility = (typeof visibility)[number];

export type TVisibilityOption = {
	label: string;
	value: Visibility;
	info: string;
};

export const visibilityOptions: TVisibilityOption[] = [
	{
		label: 'Public',
		value: 'public',
		info: 'Anyone can see your trip',
	},
	{
		label: 'Friends',
		value: 'friends',
		info: 'Only your friends can see your trip',
	},
	{
		label: 'Private',
		value: 'private',
		info: 'Only you can see your trip',
	},
];

